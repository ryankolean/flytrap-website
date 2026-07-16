#!/usr/bin/env node
// Automated weekly-specials sync: Toast "Weekly Specials" group -> data.js.
//
// The standing menu is intentionally NOT touched — it stays hand-curated. Only
// the specials, which turn over weekly, are pulled from Toast (the source of
// truth) so nobody has to hand-edit the site each week.
//
// Zero extra deps (Node 20+ global fetch). Reuses the already-tested
// apps-script/lib/specials.js (buildSpecialsBlock / spliceSpecials) so the block
// format stays identical to the manual path. Lives under .github/ so the repo's
// guardrails ESM grep ignores its imports and the no-build rule holds.
//
// Flow: auth -> GET /menus/v2/menus -> find the "Weekly Specials" group ->
// keep only items that carry a Toast photo -> download each photo into
// assets/specials/ -> rewrite the /* SPECIALS:START..END */ block in data.js.
// Also reads the "Soup of the Day" item's Cup/Bowl modifier prices and writes
// them into soupSpecial (flavor stays hand-set); missing soup = soup left as-is.
//
// Fallback: ANY auth/API/download error throws before writing, so the last-good
// specials committed in data.js stay live. An empty/photo-less group is also a
// no-op (never blanks the section).
//
// Exit codes: 0 = wrote a change OR clean no-op; 1 = hard error (nothing written).
//
// Offline test:
//   TOAST_MENUS_FIXTURE=.github/scripts/fixtures/specials.sample.json \
//   node .github/scripts/specials-sync.mjs

import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import specialsLib from '../../apps-script/lib/specials.js'

const { buildSpecialsBlock, spliceSpecials, updateSoupSpecial } = specialsLib

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '..', '..')
const DATA_JS = resolve(REPO_ROOT, 'data.js')
const ASSETS_DIR = resolve(REPO_ROOT, 'assets/specials')

const HOST = process.env.TOAST_HOSTNAME || 'https://ws-api.toasttab.com'
const CLIENT_ID = process.env.TOAST_CLIENT_ID
const CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET
const RESTAURANT_GUID = process.env.TOAST_RESTAURANT_GUID
const SPECIALS_GROUP = process.env.TOAST_SPECIALS_GROUP || 'Weekly Specials'
const VEG_MARKER = process.env.TOAST_VEG_MARKER || '(v)'
const DRY_RUN = !!process.env.TOAST_DRY_RUN

// Soup of the Day: a standing Toast item that carries Cup + Bowl as modifiers.
// We read those two modifier prices and write them into soupSpecial in data.js
// (the flavor stays hand-set). Item + option names are matched case-insensitively;
// override via env if Kara names them differently.
const SOUP_ITEM = process.env.TOAST_SOUP_ITEM || 'Soup of the Day'
const SOUP_CUP_MARKER = process.env.TOAST_SOUP_CUP || 'cup'
const SOUP_BOWL_MARKER = process.env.TOAST_SOUP_BOWL || 'bowl'

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const exists = (p) => access(p).then(() => true, () => false)

// Vegetarian detection. A "(v)" tag alone is unreliable (depends on Kara tagging
// every dish), so the primary signal is inverted: a special is vegetarian unless
// its Toast description names a meat/seafood. The VEG_MARKER stays as an explicit
// override for mock-meat cases the word list would misread (e.g. "tempeh bacon").
const MEAT_TERMS = [
  // beef / red meat
  'beef', 'steak', 'brisket', 'flank', 'ribeye', 'sirloin', 'pastrami', 'meatball', 'meatloaf',
  'burger', 'hamburger', 'cheeseburger',
  // pork
  'pork', 'bacon', 'ham', 'sausage', 'chorizo', 'salami', 'pepperoni', 'prosciutto', 'pancetta',
  'carnitas', 'ribs', 'bratwurst', 'kielbasa', 'guanciale',
  // poultry
  'chicken', 'turkey', 'duck', 'poultry',
  // other land meat
  'lamb', 'veal', 'goat', 'bison', 'venison', 'rabbit', 'gyro', 'meat',
  // seafood (vegetarians exclude fish/shellfish)
  'fish', 'salmon', 'tuna', 'cod', 'halibut', 'trout', 'anchovy', 'anchovies', 'sardine',
  'mackerel', 'shrimp', 'prawn', 'crab', 'lobster', 'oyster', 'clam', 'mussel', 'scallop',
  'squid', 'octopus', 'calamari', 'crawfish', 'crayfish', 'seafood',
  // spanish (the menu uses them: "carnitas", "El Puerco", etc.)
  'carne', 'pollo', 'cerdo', 'puerco', 'res', 'pescado', 'camaron', 'camarones', 'jamon',
  'tocino', 'birria', 'barbacoa', 'chuleta',
]
const MEAT_RE = new RegExp(`\\b(?:${MEAT_TERMS.join('|')})\\b`, 'i')

export function containsMeat(desc) {
  return MEAT_RE.test(String(desc == null ? '' : desc))
}

// Returns { desc, veg }: desc with the veg marker stripped, veg = explicit marker
// OR no meat term found.
export function classifyVeg(rawDescription, marker = VEG_MARKER) {
  const raw = String(rawDescription == null ? '' : rawDescription).trim()
  const hasMarker = raw.includes(marker)
  const desc = hasMarker ? raw.split(marker).join('').replace(/\s+/g, ' ').trim() : raw
  return { desc, veg: hasMarker || !containsMeat(desc) }
}

async function login() {
  const r = await fetch(`${HOST}/authentication/v1/authentication/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, userAccessType: 'TOAST_MACHINE_CLIENT' }),
  })
  if (!r.ok) throw new Error(`Auth failed ${r.status}: ${await r.text()}`)
  const j = await r.json()
  const token = j?.token?.accessToken || j?.accessToken
  if (!token) throw new Error('No accessToken in auth response')
  return token
}

async function apiGet(token, path) {
  const r = await fetch(`${HOST}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Toast-Restaurant-External-ID': RESTAURANT_GUID },
  })
  if (!r.ok) throw new Error(`GET ${path} failed ${r.status}: ${await r.text()}`)
  return r.json()
}

// Depth-first search for a menu group by exact name.
function findGroup(payload, name) {
  const stack = []
  for (const menu of (payload.menus || [])) for (const g of (menu.menuGroups || [])) stack.push(g)
  while (stack.length) {
    const g = stack.pop()
    if (g.name === name) return g
    for (const sub of (g.menuGroups || [])) stack.push(sub)
  }
  return null
}

async function downloadImage(url, destPath) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`image fetch ${r.status} for ${url}`)
  await writeFile(destPath, Buffer.from(await r.arrayBuffer()))
}

// Preserve the existing weekOf so a re-run doesn't churn data.js when the
// specials themselves are unchanged (weekOf isn't rendered; keep it stable).
function currentWeekOf(src) {
  const m = src.match(/weekOf:\s*"([^"]*)"/)
  return m ? m[1] : ''
}

// Build the specials list (no network) from the Toast group: photo-gated,
// veg-marker stripped, local photo path per item.
function extractSpecials(payload) {
  const group = findGroup(payload, SPECIALS_GROUP)
  if (!group) throw new Error(`Toast group "${SPECIALS_GROUP}" not found — refusing to touch specials.`)
  const items = (group.menuItems || []).filter((it) => it.image)
  return items.map((it) => {
    const { desc, veg } = classifyVeg(it.description)
    return {
      name: it.name,
      desc,
      veg,
      price: it.price,
      photo: `assets/specials/toast-${slug(it.name)}.jpg`,
      image: it.image, // source URL, used for download; not written to data.js
    }
  })
}

// Flatten the modifier options on a Toast menu item. Toast's Menus v2 nests
// option items under modifierGroups[].modifierOptions[]; we also accept the
// optionGroups/options aliases and recurse nested groups so a small schema drift
// (or Kara's exact modifier layout) still resolves. Returns [{ name, price }].
function collectModifierOptions(item) {
  const out = []
  const visit = (groups) => {
    for (const g of (groups || [])) {
      for (const o of (g.modifierOptions || g.options || g.items || [])) {
        if (o && o.name != null) out.push({ name: String(o.name), price: o.price })
      }
      if (g.modifierGroups || g.optionGroups) visit(g.modifierGroups || g.optionGroups)
    }
  }
  visit(item.modifierGroups || item.optionGroups || item.modifiers || [])
  return out
}

// Find the "Soup of the Day" item anywhere in the Toast menu tree and read its
// Cup / Bowl modifier prices. Returns { cup?, bowl? }, or null when the item or
// both modifiers are missing — in which case the caller leaves the hand-set
// soupSpecial untouched (never blanks it). Exported for tests.
export function extractSoup(payload, opts = {}) {
  const needle = String(opts.soupItem || SOUP_ITEM).toLowerCase()
  const cupRe = new RegExp(opts.cupMarker || SOUP_CUP_MARKER, 'i')
  const bowlRe = new RegExp(opts.bowlMarker || SOUP_BOWL_MARKER, 'i')
  let found = null
  const walk = (group) => {
    if (!group || found) return
    for (const it of (group.menuItems || [])) {
      if (String(it.name || '').toLowerCase().includes(needle)) { found = it; return }
    }
    for (const sub of (group.menuGroups || [])) { walk(sub); if (found) return }
  }
  for (const menu of (payload.menus || [])) {
    for (const group of (menu.menuGroups || [])) { walk(group); if (found) break }
  }
  if (!found) return null
  const options = collectModifierOptions(found)
  const priceFor = (re) => {
    const o = options.find((x) => re.test(x.name))
    return o && o.price != null ? o.price : null
  }
  const cup = priceFor(cupRe)
  const bowl = priceFor(bowlRe)
  if (cup == null && bowl == null) return null
  const soup = {}
  if (cup != null) soup.cup = cup
  if (bowl != null) soup.bowl = bowl
  return soup
}

async function main() {
  const fixture = process.env.TOAST_MENUS_FIXTURE
  let payload
  if (fixture) {
    payload = JSON.parse(await readFile(resolve(REPO_ROOT, fixture), 'utf8'))
  } else {
    if (!CLIENT_ID || !CLIENT_SECRET || !RESTAURANT_GUID) {
      console.log('Toast credentials not configured — skipping (no-op).')
      return
    }
    const token = await login()
    console.log('Auth OK.')
    payload = await apiGet(token, '/menus/v2/menus')
  }

  const specials = extractSpecials(payload)
  const soup = extractSoup(payload)
  if (!specials.length && !soup) {
    console.log(`No photo'd specials in "${SPECIALS_GROUP}" and no soup cup/bowl modifiers — leaving data.js untouched.`)
    return
  }

  const src = await readFile(DATA_JS, 'utf8')
  let next = src
  if (specials.length) {
    const block = buildSpecialsBlock({
      weekOf: currentWeekOf(src),
      specials: specials.map(({ image, ...s }) => s),
    })
    next = spliceSpecials(next, block)
  }
  if (soup) next = updateSoupSpecial(next, soup)

  if (DRY_RUN) {
    console.log(`[dry-run] ${specials.length} specials: ${specials.map((s) => s.name).join(', ') || '(none)'}`)
    if (soup) console.log(`[dry-run] soup cup/bowl: cup=${soup.cup ?? '-'} bowl=${soup.bowl ?? '-'}`)
    return
  }

  const imagesReady = fixture || (await Promise.all(specials.map((s) => exists(resolve(REPO_ROOT, s.photo))))).every(Boolean)
  if (next === src && imagesReady) {
    console.log('Specials + soup unchanged — nothing to do.')
    return
  }

  if (!fixture && specials.length) {
    await mkdir(ASSETS_DIR, { recursive: true })
    for (const s of specials) await downloadImage(s.image, resolve(REPO_ROOT, s.photo))
  }
  await writeFile(DATA_JS, next)
  const wrote = [specials.length ? `${specials.length} specials` : '', soup ? 'soup cup/bowl' : ''].filter(Boolean).join(' + ')
  console.log(`Wrote ${wrote} to data.js${fixture ? ' [fixture, images skipped]' : (specials.length ? ' (+ images)' : '')}.`)
}

// Only run when executed directly (not when imported by tests).
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1) })
}
