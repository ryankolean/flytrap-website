#!/usr/bin/env node
// Toast Menus API -> assets/menu.json generator (the site's live menu).
//
// Zero-dependency (Node 20+ global fetch, no package.json, no node_modules).
// Lives under .github/ so the repo's guardrails ESM grep ignores it and the
// no-build invariant is preserved. The served site stays 100% static: the site
// fetches the committed assets/menu.json at page load; if that fetch fails it
// falls back to the hand-curated menu inlined in data.js (FT_DATA.menuItems).
//
// The site shows exactly what is on the current Toast menu. We do NOT reflect
// stock/86 status — out-of-stock items are neither hidden nor greyed; only the
// published menu structure matters. (An item removed from the Toast menu simply
// stops appearing on the next sync.)
//
// Flow every run:
//   1. auth   -> POST /authentication/v1/authentication/login  (client credentials)
//   2. menu   -> GET  /menus/v2/metadata (for lastUpdated) + GET /menus/v2/menus.
//   3. build  -> { categories, items } from the menu groups and write
//                assets/menu.json only when the content actually changed, so an
//                unchanged menu commits nothing (byte-identical output).
//
// SAFETY: any auth/API/parse error throws BEFORE anything is written, so the
// last-good assets/menu.json committed in the repo stays live. buildBase refuses
// to emit an empty menu. A Toast outage can never blank the site.
//
// Exit codes: 0 = wrote a change OR clean no-op (up to date / creds absent);
//             1 = hard error (auth / API / parse failure).
//
// Offline test (no network):
//   TOAST_MENUS_FIXTURE=.github/scripts/fixtures/menus.sample.json \
//   node .github/scripts/toast-sync.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '..', '..')
const MENU_JSON = resolve(REPO_ROOT, 'assets', 'menu.json')

// --- Toast connection (from GitHub Actions secrets) ---
const HOST = process.env.TOAST_HOSTNAME || 'https://ws-api.toasttab.com'
const CLIENT_ID = process.env.TOAST_CLIENT_ID
const CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET
const RESTAURANT_GUID = process.env.TOAST_RESTAURANT_GUID

// --- Conventions the restaurant controls (confirm with Kara/Gavin) ---
// Veg marker: a token Kara appends to a Toast item description to flag it
// vegetarian. It is stripped from the displayed description and sets veg:true.
const VEG_MARKER = process.env.TOAST_VEG_MARKER || '(v)'
// Toast menu-group names to EXCLUDE, comma-separated. Default hides the retail
// groups (shown in the hand-built Retail section) and the "Weekly Specials"
// group (pulled by the separate specials sync + shown in the Specials tab) so
// they are not duplicated. Everything else is included as-is — no $0/add-on
// filtering yet; curation is deferred until Kara & Sean decide how they want the
// standing menu to read. Override with TOAST_EXCLUDE_GROUPS.
const EXCLUDE_GROUPS = (process.env.TOAST_EXCLUDE_GROUPS ||
  'Weekly Specials,SWAT! Sauce,WHAM! Jam,Fly Trap Swag')
  .split(',').map((s) => s.trim()).filter(Boolean)
// Optional per-group presentation overrides keyed by Toast group name, so the
// playful category titles + blurbs can survive the pull. Example:
//   "Eggs": { title: "All Things Eggs", sub: "Comes with toast & spuds." }
const GROUP_OVERRIDES = {}

// ---------------------------------------------------------------------------

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fmtPrice = (p) => (p == null || p === '') ? '' : Number(p).toFixed(2)

// Recursively walk Toast menu groups; every group that has items becomes a
// category. Nested subgroups become their own categories.
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
      const entry = { cat: id, nm: it.name, desc, price: fmtPrice(it.price) }
      if (veg) entry.veg = true
      if (it.image) entry.img = it.image
      items.push(entry)
    }
  }
  for (const sub of (group.menuGroups || [])) collect(sub, categories, items)
}

// Toast /menus response -> { categories, items }.
function buildBase(payload) {
  const categories = []
  const items = []
  for (const menu of (payload.menus || [])) {
    for (const group of (menu.menuGroups || [])) collect(group, categories, items)
  }
  if (!categories.length) throw new Error('Toast returned no menu groups with items — refusing to blank the menu.')
  return { categories, items }
}

// { categories, items } -> the menu.json object the site fetches. No volatile
// timestamp is written, so an unchanged menu produces byte-identical output and
// the workflow commits nothing.
function buildMenuJson({ categories, items }, lastUpdated) {
  return {
    source: 'toast',
    lastUpdated: lastUpdated || null,
    categories: categories.map((c) => ({ id: c.id, title: c.title, sub: c.sub == null ? null : c.sub })),
    items: items.map((it) => {
      const e = { cat: it.cat, nm: it.nm, desc: it.desc, price: it.price }
      if (it.veg) e.veg = true
      if (it.img) e.img = it.img
      return e
    }),
  }
}

async function writeMenuJson(obj) {
  const next = JSON.stringify(obj, null, 2) + '\n'
  let prev = null
  try { prev = await readFile(MENU_JSON, 'utf8') } catch { /* first write */ }
  if (prev === next) return false
  await writeFile(MENU_JSON, next)
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

async function readJson(relPath) {
  return JSON.parse(await readFile(resolve(REPO_ROOT, relPath), 'utf8'))
}

// Write a human-readable markdown listing of every menu group + item, flagging
// whether the item carries a photo and which groups are excluded by default.
async function writeDump(payload, path) {
  const lines = ['# Toast menu dump', '']
  const walk = (group) => {
    const excluded = EXCLUDE_GROUPS.includes(group.name)
    const items = group.menuItems || []
    if (items.length) {
      lines.push(`### ${group.name}${excluded ? ' _(excluded by default)_' : ''} — ${items.length} items`)
      for (const it of items) {
        const price = (it.price == null || it.price === '') ? '' : ` — $${Number(it.price).toFixed(2)}`
        lines.push(`- ${it.name}${price}${it.image ? '  [photo]' : ''}`)
      }
      lines.push('')
    }
    for (const sub of (group.menuGroups || [])) walk(sub)
  }
  for (const menu of (payload.menus || [])) {
    lines.push(`## ${menu.name}`, '')
    for (const group of (menu.menuGroups || [])) walk(group)
  }
  await writeFile(path, lines.join('\n') + '\n')
}

async function main() {
  // Offline path: transform a saved sample payload, no network.
  if (process.env.TOAST_MENUS_FIXTURE) {
    const base = buildBase(await readJson(process.env.TOAST_MENUS_FIXTURE))
    const changed = await writeMenuJson(buildMenuJson(base, 'fixture'))
    console.log(`[fixture] ${changed ? 'wrote' : 'no change to'} assets/menu.json (${base.items.length} items).`)
    return
  }

  if (!CLIENT_ID || !CLIENT_SECRET || !RESTAURANT_GUID) {
    console.log('Toast credentials not configured — skipping (no-op). Set TOAST_CLIENT_ID, TOAST_CLIENT_SECRET, TOAST_RESTAURANT_GUID.')
    return
  }

  const dryRun = !!process.env.TOAST_DRY_RUN

  const token = await login()
  console.log('Auth OK.')

  // Only pull /menus when Toast's published timestamp changed.
  const meta = await apiGet(token, '/menus/v2/metadata')
  const lastUpdated = meta?.lastUpdated || meta?.lastPublished || null

  // Full listing to a file, every group (incl. excluded), for review.
  if (process.env.TOAST_DUMP) {
    await writeDump(await apiGet(token, '/menus/v2/menus'), process.env.TOAST_DUMP)
    console.log(`[dump] wrote full menu listing to ${process.env.TOAST_DUMP}`)
    return
  }

  const payload = await apiGet(token, '/menus/v2/menus')
  const base = buildBase(payload)
  console.log(`Pulled menu from Toast (lastUpdated=${lastUpdated}, ${base.items.length} items).`)

  if (dryRun) {
    console.log('[dry-run] auth + menu reachable. Nothing written.')
    console.log(`[dry-run] excluded groups: ${EXCLUDE_GROUPS.join(', ') || 'none'}`)
    console.log(`[dry-run] SHOWN on site: ${base.categories.length} categories, ${base.items.length} items.`)
    for (const c of base.categories) {
      console.log(`[dry-run]   ${c.title}: ${base.items.filter((i) => i.cat === c.id).length} items`)
    }
    console.log(`[dry-run] veg items flagged: ${base.items.filter((i) => i.veg).length} (using marker ${JSON.stringify(VEG_MARKER)})`)
    return
  }

  const changed = await writeMenuJson(buildMenuJson(base, lastUpdated))
  console.log(changed
    ? `Wrote assets/menu.json (${base.items.length} items).`
    : `assets/menu.json already current (${base.items.length} items).`)
}

main().catch((e) => { console.error(String(e?.stack || e)); process.exit(1) })
