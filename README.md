# The Fly Trap — static site

Plain static HTML/CSS/JS. No build step. Open `index.html` in a browser, or serve the directory with any static server.

## Quick start

```bash
# any static server works; here are two:
npx serve .
# or
python3 -m http.server 8000
```

Then visit http://localhost:8000 (or whatever port your server prints).

## Stack

- HTML + CSS + React (loaded via UMD `<script>` tags)
- JSX transpiled in-browser via Babel standalone
- No bundler, no npm install

## Files

- `index.html` — entry point
- `App.jsx` — root component, navigation, hero
- `Nav.jsx`, `Hero.jsx`, `Menu.jsx`, `Sections.jsx` — page sections
- `data.js` — menu + content data
- `colors_and_type.css`, `site.css` — styles
- `assets/` — images, paintings, wordmarks
- `fonts/` — self-hosted Fraunces + Inter (woff2)

## Deploy

Drop the contents of this folder onto any static host (Vercel, Netlify, GitHub Pages, S3+CloudFront). No env vars, no server.
