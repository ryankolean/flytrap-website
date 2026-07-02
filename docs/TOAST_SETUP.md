# Toast menu sync — setup

Goal: the website's menu updates itself whenever the restaurant updates the menu
in Toast. No more hand-editing `data.js`; no backend; the site stays a static
GitHub Pages site.

This doc has two audiences:
- **For Kara / Gavin / Sean** — what the restaurant has to do in Toast, and the
  two menu conventions we need decided. That's the only thing blocking go-live.
- **For us (the repo)** — what's already built and how it runs.

---

## 1. What we need from the restaurant (Sean)

Toast calls this **Standard API Access**. The restaurant issues its own
read-only credentials for its own menu data — no partner onboarding, no cost
beyond the existing Toast subscription.

### Prerequisites (one-time)
- Toast **Restaurant Management Suite (RMS) Essentials or higher** on The Fly
  Trap location. (Lower tiers show a locked icon and can't issue credentials.)
- The Toast user doing this needs the **Manage Integrations** permission.

### Steps in Toast Web
1. Go to **Integrations → Toast API access → Manage credentials**.
2. Click **Create new credentials** → choose **Standard API**.
3. **Credential name:** `Website menu sync`.
4. **Select scopes:** enable **`menus:read`** (read menu data). Nothing else is
   needed — this is read-only.
5. **Select locations:** pick **The Fly Trap Ferndale** (or "all locations" if
   the group is just the one), then **Apply**.
6. **Confirm.**
7. Open the credential again (pencil / edit icon) to copy the values.

### Send us three values (securely — see note below)
| Value | Where to find it |
|---|---|
| **Client ID** | Manage credentials → edit → copy icon next to **Client ID** |
| **Client Secret** | shown once at creation; copy it then (also in the credential view) |
| **Restaurant GUID** | in the confirmation email Toast sends — listed as the location's **GUID** (a.k.a. `Toast-Restaurant-External-ID`) |

> Do **not** email the client secret in plaintext. Send it via 1Password, a
> Toast-side secure share, or drop it straight into the GitHub repo secrets
> (below). Treat it like a password.

---

## 2. Two menu conventions we need decided

These aren't blockers for wiring up the pipe, but the menu won't render 100%
right until they're settled. Both are things **Kara controls inside Toast**.

1. **Vegetarian marker.** The site shows a green-leaf on veg items. Toast has no
   dedicated "vegetarian" flag we can read, so Kara picks a small token to append
   to a veg item's **description** in Toast — e.g. `(v)` at the end. We strip it
   from the printed description and turn on the leaf. **Decision needed:** what's
   the token? Default assumed: `(v)`.

2. **Specials.** Today "Specials" is the default menu tab, sourced weekly from
   the Instagram post. Question: **how do specials live in Toast?** Options:
   - a dedicated Toast **menu group** named e.g. `Specials` (cleanest — we read
     it straight through), or
   - keep specials on the current Instagram flow and let Toast drive only the
     standing menu (fine for phase 1).

   **Decision needed:** dedicated Toast group, or leave specials as-is for now?

Until #2 is decided, the sync regenerates **only the standing menu**
(`menuCategories` + `menuItems`); specials stay on the Instagram flow. Nothing
about the current specials behavior changes.

---

## 3. Installing the credentials (us)

Once Sean sends the three values, add them as repo secrets:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `TOAST_CLIENT_ID` | client id |
| `TOAST_CLIENT_SECRET` | client secret |
| `TOAST_RESTAURANT_GUID` | restaurant / location GUID |

Optional overrides (only if needed):
| Secret name | Default | Use |
|---|---|---|
| `TOAST_HOSTNAME` | `https://ws-api.toasttab.com` | if Toast issues a different prod host |
| `TOAST_VEG_MARKER` | `(v)` | match Kara's chosen veg token |
| `TOAST_EXCLUDE_GROUPS` | _(none)_ | comma-separated Toast group names to hide |

That's it. The workflow no-ops safely until all three required secrets exist, so
this can merge before the credentials arrive.

---

## 4. How it works (implementation)

- **`.github/scripts/toast-sync.mjs`** — zero-dependency Node (uses the built-in
  `fetch`; no `package.json`, no `node_modules`, so the no-build rule holds).
  1. Authenticates: `POST /authentication/v1/authentication/login` with
     `{ clientId, clientSecret, userAccessType: "TOAST_MACHINE_CLIENT" }` →
     bearer `accessToken`.
  2. Cheap change check: `GET /menus/v2/metadata` returns `lastUpdated`. If it
     matches the stored value (`.github/scripts/.toast-menu-state.json`), it
     stops — no full pull.
  3. On change: `GET /menus/v2/menus` (both requests send
     `Authorization: Bearer …` + `Toast-Restaurant-External-ID: <GUID>`).
  4. Transforms Toast's `menus → menuGroups → menuItems` into our
     `menuCategories` / `menuItems` shape (name, description, price, `veg`,
     optional `img`), and splices it into `data.js` **between the
     `TOAST-SYNC:START/END` markers** — everything else in `data.js` (press,
     buzz, specials, dishes) is left untouched.
  5. Refuses to write an empty menu (guards against a bad pull blanking the site).

- **`.github/workflows/toast-menu-sync.yml`** — runs every 30 min during open
  hours and on manual dispatch. On a real change it commits `data.js` to `main`
  and triggers the Pages deploy. (The automated menu commit to `main` is the one
  sanctioned exception to the "everything via PR" rule — it's a bot syncing a
  data file, and it only ever touches the marked menu region.)

- Menus API returns **published data only**, so drafts in Toast won't leak to the
  site until Kara publishes.

### Test it offline (no credentials)
```bash
TOAST_MENUS_FIXTURE=.github/scripts/fixtures/menus.sample.json \
  node .github/scripts/toast-sync.mjs
```
Regenerates the menu region from the sample payload so you can eyeball the
transform. `git checkout data.js` to revert.

### Notes / limits
- **Menu-as-home-screen** and a **variable-count specials tab** are the remaining
  UI pieces (see ROADMAP.md) — separate from this data pipeline.
- Menus API V3 exists but is for **ordering** integrations; a read-only menu
  mirror correctly uses **V2** (`menus:read`).
- Toast doc references: Authentication, Menus API V2 overview, Scopes, and
  Standard API access requirements at <https://doc.toasttab.com/>.
