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
// Also reads the "Soup O' The Day" item (flavor from its description, cup from
// its base price, bowl from a size modifier, and an out-of-stock flag) into
// soupSpecial, and the mini-muffin item (price + its description as the flavor)
// into muffinSpecial. On an out-of-stock soup day the flavor/message is kept and
// the prices cleared, so the site shows the message alone. Missing soup/muffin =
// that card left as-is.
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

const { buildSpecialsBlock, spliceSpecials, updateSoupSpecial, updateMuffinSpecial } = specialsLib

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

// Soup of the Day. The current Toast menu carries it as a single "Soup O' The
// Day" item — flavor in the description, cup price = the item's base price, bowl
// price = a size modifier (when offered), and an out-of-stock flag for the "no
// soup today" days. Older menus split it into separate "Cup of Soup" / "Bowl of
// Soup" items that share a description; that shape is still handled as a fallback.
// All names are matched case-insensitively; override via env if Kara renames them.
const SOUP_ITEM = process.env.TOAST_SOUP_ITEM || "Soup O' The Day"
const SOUP_CUP_ITEM = process.env.TOAST_SOUP_CUP_ITEM || 'Cup of Soup'
const SOUP_BOWL_ITEM = process.env.TOAST_SOUP_BOWL_ITEM || 'Bowl of Soup'

// Mini muffin: one Toast item (matched loosely on "muffin") whose description is
// the day's flavor and whose price feeds the muffin card. name stays hand-set.
const MUFFIN_ITEM = process.env.TOAST_MUFFIN_ITEM || 'Muffin'

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

// Find the first Toast menu item whose name matches `needle` (case-insensitive
// substring) anywhere in the menu tree. Returns the item, or null.
function findMenuItem(payload, needle) {
  const want = String(needle).toLowerCase()
  let found = null
  const walk = (group) => {
    if (!group || found) return
    for (const it of (group.menuItems || [])) {
      if (String(it.name || '').toLowerCase().includes(want)) { found = it; return }
    }
    for (const sub of (group.menuGroups || [])) { walk(sub); if (found) return }
  }
  for (const menu of (payload.menus || [])) {
    for (const group of (menu.menuGroups || [])) { walk(group); if (found) break }
  }
  return found
}

// The soup's flavor is the Toast item description, kept verbatim — including the
// 🥬 (U+1F96C) glyph Kara appends for a vegetarian soup, which the site renders
// inline the same way it does on specials and menu items (there is no separate
// veg flag). Only whitespace is normalised.
const cleanFlavor = (d) => String(d == null ? '' : d).replace(/\s+/g, ' ').trim()

// Resolve a soup *size* modifier option (e.g. "Cup" / "Bowl") for an item and
// return the option object, or null. Toast's /menus/v2 delivers the size group by
// integer reference — item.modifierGroupReferences -> payload.modifierGroupReferences
// -> a group whose modifierOptionReferences index into payload.modifierOptionReferences
// — so resolve those top-level maps. Inline modifier objects (older / other shapes)
// are also handled. The option's `price` is the size *upcharge* on the item's base
// price (Toast gives Cup +$0 / Bowl +$1), not an absolute price.
function sizeOption(payload, item, needle) {
  if (!item) return null
  const want = String(needle).toLowerCase()
  const grpMap = (payload && payload.modifierGroupReferences) || {}
  const optMap = (payload && payload.modifierOptionReferences) || {}
  const at = (map, ref) => (ref == null ? null : (map[ref] != null ? map[ref] : map[String(ref)]))

  const groups = []
  const inlineGroups = item.modifierGroups || item.modifiers
  if (Array.isArray(inlineGroups)) for (const g of inlineGroups) if (g && typeof g === 'object') groups.push(g)
  if (Array.isArray(item.modifierGroupReferences)) {
    for (const gref of item.modifierGroupReferences) { const g = at(grpMap, gref); if (g && typeof g === 'object') groups.push(g) }
  }

  for (const g of groups) {
    const opts = []
    const inlineOpts = g.modifierOptions || g.options || g.items || g.modifiers
    if (Array.isArray(inlineOpts)) for (const o of inlineOpts) if (o && typeof o === 'object') opts.push(o)
    if (Array.isArray(g.modifierOptionReferences)) {
      for (const oref of g.modifierOptionReferences) { const o = at(optMap, oref); if (o && typeof o === 'object') opts.push(o) }
    }
    for (const o of opts) {
      if (String(o.name || '').toLowerCase().includes(want) && o.price != null) return o
    }
  }
  return null
}

// Soup of the Day -> { available, flavor?, cup, bowl } or null. `available` is
// the in-stock flag: on an out-of-stock day the flavor carries whatever Kara
// typed (e.g. "No soup on the weekend!") and cup/bowl are cleared, so the site
// shows that message alone with no price hanging off it. null (no soup item at
// all) leaves the hand-set soupSpecial untouched — the sync never blanks it.
// Exported for tests.
export function extractSoup(payload, opts = {}) {
  // Current menu shape: a single "Soup O' The Day" item.
  const item = findMenuItem(payload, opts.soupItem || SOUP_ITEM)
  if (item) return soupFromSingleItem(payload, item, opts)
  // Legacy menu shape: separate "Cup of Soup" / "Bowl of Soup" items.
  return soupFromCupBowlItems(payload, opts)
}

function soupFromSingleItem(payload, item, opts) {
  const available = item.outOfStock !== true
  const soup = { available }
  const flavor = cleanFlavor(item.description)
  if (flavor) soup.flavor = flavor
  if (!available) {
    soup.cup = ''
    soup.bowl = ''
    return soup
  }
  // Base price is the Cup; the Bowl is a size modifier priced as an upcharge on it
  // (Cup +$0, Bowl +$1 -> Bowl = base + $1). The size group is referenced by id, so
  // sizeOption resolves it against the payload's top-level modifier maps.
  const base = item.price != null ? Number(item.price) : null
  const cupOpt = sizeOption(payload, item, 'cup')
  const bowlOpt = sizeOption(payload, item, 'bowl')
  soup.cup = base != null ? base + Number((cupOpt && cupOpt.price) || 0) : ''
  if (bowlOpt && bowlOpt.price != null && base != null) {
    soup.bowl = base + Number(bowlOpt.price)
  } else {
    // Legacy fallback: a separate "Bowl of Soup" item carrying an absolute price.
    const bowlItem = findMenuItem(payload, opts.bowlItem || SOUP_BOWL_ITEM)
    soup.bowl = bowlItem && bowlItem.price != null ? bowlItem.price : ''
  }
  return soup
}

function soupFromCupBowlItems(payload, opts) {
  const cupItem = findMenuItem(payload, opts.cupItem || SOUP_CUP_ITEM)
  const bowlItem = findMenuItem(payload, opts.bowlItem || SOUP_BOWL_ITEM)
  if (!cupItem && !bowlItem) return null

  // Available unless every present soup item is flagged out of stock.
  const present = [cupItem, bowlItem].filter(Boolean)
  const available = present.some((it) => it.outOfStock !== true)

  const soup = { available }
  if (available) {
    if (cupItem && cupItem.price != null) soup.cup = cupItem.price
    if (bowlItem && bowlItem.price != null) soup.bowl = bowlItem.price
  } else {
    soup.cup = ''
    soup.bowl = ''
  }

  const cupDesc = cleanFlavor(cupItem && cupItem.description)
  const bowlDesc = cleanFlavor(bowlItem && bowlItem.description)
  if (cupDesc && bowlDesc) {
    if (cupDesc === bowlDesc) soup.flavor = cupDesc
    else console.warn(`[soup] Cup/Bowl descriptions differ — leaving flavor hand-set. cup=${JSON.stringify(cupDesc)} bowl=${JSON.stringify(bowlDesc)}`)
  } else if (cupDesc || bowlDesc) {
    soup.flavor = cupDesc || bowlDesc
  }

  if (soup.flavor == null && soup.cup == null && soup.bowl == null) return null
  return soup
}

// Read the mini-muffin item's price + flavor (its description) from Toast. Returns
// { price?, flavor? } or null when the item is missing — caller then leaves the
// hand-set muffinSpecial untouched (never blanks it). Exported for tests.
export function extractMuffin(payload, opts = {}) {
  const item = findMenuItem(payload, opts.muffinItem || MUFFIN_ITEM)
  if (!item) return null
  const muffin = {}
  if (item.price != null) muffin.price = item.price
  const flavor = String(item.description == null ? '' : item.description).replace(/\s+/g, ' ').trim()
  if (flavor) muffin.flavor = flavor
  if (muffin.price == null && muffin.flavor == null) return null
  return muffin
}

async function main() {
  const fixture = process.env.TOAST_MENUS_FIXTURE
  const payloadIn = process.env.TOAST_PAYLOAD_IN
  let payload
  if (fixture) {
    payload = JSON.parse(await readFile(resolve(REPO_ROOT, fixture), 'utf8'))
  } else if (payloadIn) {
    // Reuse the payload the menu step already pulled — no second /menus call.
    // Toast caps GET /menus at 1 req/sec per location, and hitting it twice per
    // run (menu + specials) was returning 429. An absent file means the menu was
    // unchanged this run (the menu step skipped its pull), so there's nothing to do.
    if (!(await exists(resolve(REPO_ROOT, payloadIn)))) {
      console.log('No shared Toast payload (menu unchanged this run) — nothing to do.')
      return
    }
    payload = JSON.parse(await readFile(resolve(REPO_ROOT, payloadIn), 'utf8'))
    console.log('Using the menu payload shared by the menu step (no Toast call).')
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
  const muffin = extractMuffin(payload)
  if (!specials.length && !soup && !muffin) {
    console.log(`No photo'd specials in "${SPECIALS_GROUP}" and no soup/muffin items — leaving data.js untouched.`)
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
  if (muffin) next = updateMuffinSpecial(next, muffin)

  if (DRY_RUN) {
    console.log(`[dry-run] ${specials.length} specials: ${specials.map((s) => s.name).join(', ') || '(none)'}`)
    if (soup) console.log(`[dry-run] soup: available=${soup.available} cup=${soup.cup || '-'} bowl=${soup.bowl || '-'} flavor=${soup.flavor ?? '(unchanged)'}`)
    if (muffin) console.log(`[dry-run] muffin: price=${muffin.price ?? '-'} flavor=${muffin.flavor ?? '(unchanged)'}`)
    return
  }

  const imagesReady = fixture || (await Promise.all(specials.map((s) => exists(resolve(REPO_ROOT, s.photo))))).every(Boolean)
  if (next === src && imagesReady) {
    console.log('Specials + extras unchanged — nothing to do.')
    return
  }

  if (!fixture && specials.length) {
    await mkdir(ASSETS_DIR, { recursive: true })
    for (const s of specials) await downloadImage(s.image, resolve(REPO_ROOT, s.photo))
  }
  await writeFile(DATA_JS, next)
  const wrote = [specials.length ? `${specials.length} specials` : '', soup ? 'soup' : '', muffin ? 'muffin' : ''].filter(Boolean).join(' + ')
  console.log(`Wrote ${wrote} to data.js${fixture ? ' [fixture, images skipped]' : (specials.length ? ' (+ images)' : '')}.`)
}

// Only run when executed directly (not when imported by tests).
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1) })
}
