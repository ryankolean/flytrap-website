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
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import specialsLib from '../../apps-script/lib/specials.js'

const { buildSpecialsBlock, spliceSpecials } = specialsLib

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

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const exists = (p) => access(p).then(() => true, () => false)

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
    const raw = (it.description || '').trim()
    const veg = raw.includes(VEG_MARKER)
    const desc = veg ? raw.split(VEG_MARKER).join('').replace(/\s+/g, ' ').trim() : raw
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
  if (!specials.length) {
    console.log(`No photo'd specials in "${SPECIALS_GROUP}" — leaving last-good specials untouched.`)
    return
  }

  const src = await readFile(DATA_JS, 'utf8')
  const block = buildSpecialsBlock({
    weekOf: currentWeekOf(src),
    specials: specials.map(({ image, ...s }) => s),
  })
  const next = spliceSpecials(src, block)

  if (DRY_RUN) {
    console.log(`[dry-run] ${specials.length} specials: ${specials.map((s) => s.name).join(', ')}`)
    console.log(block)
    return
  }

  const imagesReady = fixture || (await Promise.all(specials.map((s) => exists(resolve(REPO_ROOT, s.photo))))).every(Boolean)
  if (next === src && imagesReady) {
    console.log('Specials unchanged — nothing to do.')
    return
  }

  if (!fixture) {
    await mkdir(ASSETS_DIR, { recursive: true })
    for (const s of specials) await downloadImage(s.image, resolve(REPO_ROOT, s.photo))
  }
  await writeFile(DATA_JS, next)
  console.log(`Wrote ${specials.length} specials to data.js${fixture ? ' [fixture, images skipped]' : ' (+ images)'}.`)
}

main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1) })
