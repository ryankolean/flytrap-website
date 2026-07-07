#!/usr/bin/env node
// Toast Menus + Stock API -> data.js menu region generator.
//
// Zero-dependency (Node 20+ global fetch, no package.json, no node_modules).
// Lives under .github/ so the repo's guardrails ESM grep ignores it and the
// no-build invariant is preserved. The served site stays 100% static.
//
// Flow every run:
//   1. auth   -> POST /authentication/v1/authentication/login  (client credentials)
//   2. menu   -> GET  /menus/v2/metadata  (cheap); pull GET /menus/v2/menus only
//                when the published timestamp changed, else reuse the cached base.
//   3. stock  -> GET  /stock/v1/inventory  (ALWAYS — 86'ing an item does not bump
//                the menu timestamp, so stock must be checked every run).
//   4. overlay soldOut on OUT_OF_STOCK items and splice the menu region of data.js.
//
// The menu base (with Toast item GUIDs, needed to map stock) is cached in
// .toast-menu-cache.json so we honor Toast's "only pull /menus when it changed"
// guidance while still reflecting stock in near-real-time.
//
// Exit codes: 0 = wrote a change OR clean no-op (up to date / creds absent);
//             1 = hard error (auth / API / parse failure).
//
// Offline test (no network):
//   TOAST_MENUS_FIXTURE=.github/scripts/fixtures/menus.sample.json \
//   TOAST_STOCK_FIXTURE=.github/scripts/fixtures/stock.sample.json \
//   node .github/scripts/toast-sync.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '..', '..')
const DATA_JS = resolve(REPO_ROOT, 'data.js')
const CACHE_FILE = resolve(HERE, '.toast-menu-cache.json')

// --- Toast connection (from GitHub Actions secrets) ---
const HOST = process.env.TOAST_HOSTNAME || 'https://ws-api.toasttab.com'
const CLIENT_ID = process.env.TOAST_CLIENT_ID
const CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET
const RESTAURANT_GUID = process.env.TOAST_RESTAURANT_GUID

// --- Conventions the restaurant controls (confirm with Kara/Gavin) ---
// Veg marker: a token Kara appends to a Toast item description to flag it
// vegetarian. It is stripped from the displayed description and sets veg:true.
const VEG_MARKER = process.env.TOAST_VEG_MARKER || '(v)'
// Toast menu-group names to EXCLUDE from the website menu, comma-separated.
// Default hides the retail groups (already shown in the hand-built Retail
// section) and the Toast "Weekly Specials" group (specials stay on the
// Instagram flow for now). Override with TOAST_EXCLUDE_GROUPS to change it.
const EXCLUDE_GROUPS = (process.env.TOAST_EXCLUDE_GROUPS ||
  'Weekly Specials,SWAT! Sauce,WHAM! Jam,Fly Trap Swag')
  .split(',').map(s => s.trim()).filter(Boolean)
// Optional per-group presentation overrides keyed by Toast group name, so the
// playful category titles + blurbs survive the pull. Example:
//   "Eggs": { title: "All Things Eggs", sub: "Comes with toast & spuds." }
const GROUP_OVERRIDES = {}

// ---------------------------------------------------------------------------

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fmtPrice = (p) => (p == null || p === '') ? '' : Number(p).toFixed(2)
const q = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'

// Recursively walk Toast menu groups; every group that has items becomes a
// category. Nested subgroups become their own categories. Item GUIDs are
// retained (needed to map stock) and stripped before serialization.
function collect(group, categories, items) {
  if (!group || EXCLUDE_GROUPS.includes(group.name)) return
  const groupItems = group.menuItems || []
  if (groupItems.length) {
    const id = slug(group.name)
    const ov = GROUP_OVERRIDES[group.name] || {}
    categories.push({ id, title: ov.title || group.name, sub: ov.sub || null })
    for (const it of groupItems) {
      const raw = (it.description || '').trim()
      const veg = raw.includes(VEG_MARKER)
      const desc = veg ? raw.split(VEG_MARKER).join('').replace(/\s+/g, ' ').trim() : raw
      const entry = { cat: id, nm: it.name, desc, price: fmtPrice(it.price), guid: it.guid }
      if (veg) entry.veg = true
      if (it.image) entry.img = it.image
      items.push(entry)
    }
  }
  for (const sub of (group.menuGroups || [])) collect(sub, categories, items)
}

// Toast /menus response -> { categories, items } base (items carry guid).
function buildBase(payload) {
  const categories = []
  const items = []
  for (const menu of (payload.menus || [])) {
    for (const group of (menu.menuGroups || [])) collect(group, categories, items)
  }
  if (!categories.length) throw new Error('Toast returned no menu groups with items — refusing to blank the menu.')
  return { categories, items }
}

// Toast /stock/v1/inventory array -> Set of GUIDs that are OUT_OF_STOCK.
// (QUANTITY status means low-but-available, so it stays orderable.)
function outOfStockSet(inventory) {
  const set = new Set()
  for (const row of (Array.isArray(inventory) ? inventory : [])) {
    if (row && row.status === 'OUT_OF_STOCK' && row.guid) set.add(row.guid)
  }
  return set
}

// Serialize { categories, items } into the exact FT_DATA region text, including
// both markers. GUIDs are dropped; soldOut is emitted for OUT_OF_STOCK items.
function renderRegion({ categories, items }, oos) {
  const catLines = categories.map(
    (c) => `    { id: ${q(c.id)}, title: ${q(c.title)}, sub: ${c.sub == null ? 'null' : q(c.sub)} },`
  )
  const itemLines = items.map((it) => {
    let s = `    { cat: ${q(it.cat)}, nm: ${q(it.nm)}, desc: ${q(it.desc)}, price: ${q(it.price)}`
    if (it.veg) s += ', veg: true'
    if (oos.has(it.guid)) s += ', soldOut: true'
    if (it.img) s += `, img: ${q(it.img)}`
    return s + ' },'
  })
  return [
    '  // >>> TOAST-SYNC:START — generated by .github/scripts/toast-sync.mjs from Toast',
    '  // Menus API V2 + Stock API. Do not hand-edit this region; overwritten each sync.',
    '  menuCategories: [',
    ...catLines,
    '  ],',
    '  menuItems: [',
    ...itemLines,
    '  ],',
    '  // <<< TOAST-SYNC:END',
  ].join('\n')
}

const REGION_RE = /[ \t]*\/\/ >>> TOAST-SYNC:START[\s\S]*?\/\/ <<< TOAST-SYNC:END/

async function spliceDataJs(region) {
  const src = await readFile(DATA_JS, 'utf8')
  if (!REGION_RE.test(src)) throw new Error('TOAST-SYNC markers not found in data.js')
  const next = src.replace(REGION_RE, region)
  if (next === src) return false
  await writeFile(DATA_JS, next)
  return true
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

async function loadCache() {
  try { return JSON.parse(await readFile(CACHE_FILE, 'utf8')) } catch { return null }
}
async function saveCache(base) {
  await writeFile(CACHE_FILE, JSON.stringify(base, null, 2) + '\n')
}

async function readJson(relPath) {
  return JSON.parse(await readFile(resolve(REPO_ROOT, relPath), 'utf8'))
}

async function main() {
  // Offline path: transform a saved sample payload, no network.
  if (process.env.TOAST_MENUS_FIXTURE) {
    const base = buildBase(await readJson(process.env.TOAST_MENUS_FIXTURE))
    const oos = process.env.TOAST_STOCK_FIXTURE
      ? outOfStockSet(await readJson(process.env.TOAST_STOCK_FIXTURE)) : new Set()
    const changed = await spliceDataJs(renderRegion(base, oos))
    console.log(`[fixture] ${changed ? 'wrote' : 'no change to'} data.js (${base.items.length} items, ${oos.size} out of stock).`)
    return
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !RESTAURANT_GUID) {
    console.log('Toast credentials not configured — skipping (no-op). Set TOAST_CLIENT_ID, TOAST_CLIENT_SECRET, TOAST_RESTAURANT_GUID.')
    return
  }

  const dryRun = !!process.env.TOAST_DRY_RUN

  const token = await login()
  console.log('Auth OK.')

  // Menu base: only re-pull /menus when the published timestamp changed.
  const meta = await apiGet(token, '/menus/v2/metadata')
  const lastUpdated = meta?.lastUpdated || meta?.lastPublished || null
  let base = await loadCache()
  if (dryRun || !base || !base.lastUpdated || base.lastUpdated !== lastUpdated) {
    base = buildBase(await apiGet(token, '/menus/v2/menus'))
    base.lastUpdated = lastUpdated
    if (!dryRun) await saveCache(base)
    console.log(`Pulled menu from Toast (lastUpdated=${lastUpdated}, ${base.items.length} items).`)
  } else {
    console.log(`Menu unchanged (lastUpdated=${lastUpdated}); using cached base (${base.items.length} items).`)
  }

  // Stock: always checked; 86'ing does not change the menu timestamp.
  const oos = outOfStockSet(await apiGet(token, '/stock/v1/inventory'))

  if (dryRun) {
    const rows = base.categories.map((c) => {
      const its = base.items.filter((i) => i.cat === c.id)
      return { title: c.title, n: its.length, out: its.filter((i) => oos.has(i.guid)).length }
    })
    const shownOOS = rows.reduce((a, r) => a + r.out, 0)
    console.log(`[dry-run] auth + menu + stock all reachable. Nothing written.`)
    console.log(`[dry-run] excluded groups: ${EXCLUDE_GROUPS.join(', ') || 'none'}`)
    console.log(`[dry-run] SHOWN on site: ${base.categories.length} categories, ${base.items.length} items, ${shownOOS} out of stock.`)
    console.log(`[dry-run] (Toast total out-of-stock across all groups incl. excluded: ${oos.size})`)
    for (const r of rows) console.log(`[dry-run]   ${r.title}: ${r.n} items, ${r.out} out of stock`)
    console.log(`[dry-run] veg items flagged: ${base.items.filter((i) => i.veg).length} (using marker ${JSON.stringify(VEG_MARKER)})`)
    return
  }

  const changed = await spliceDataJs(renderRegion(base, oos))
  console.log(changed
    ? `Wrote data.js (${base.items.length} items, ${oos.size} out of stock).`
    : `data.js already current (${base.items.length} items, ${oos.size} out of stock).`)
}

main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1) })
