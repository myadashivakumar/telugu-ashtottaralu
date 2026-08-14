# నిత్య పారాయణం — Telugu Ashtottaram PWA

An installable, offline-capable app for daily Telugu devotional reading —
Ashtottaram (108 names), Sahasranamam, Mangala Harathi, and Vratha Katha for
19 deities: గణేశ, విష్ణు, వేంకటేశ్వర స్వామి, శివ, కేదారేశ్వర వ్రతం, మహాలక్ష్మి,
వరలక్ష్మి వ్రతం, దుర్గ, సరస్వతి, హనుమాన్, సుబ్రహ్మణ్య, సాయిబాబా, శ్రీరామ, శ్రీకృష్ణ,
అయ్యప్ప, లక్ష్మీ నరసింహ, సత్యనారాయణ, నవగ్రహ స్తోత్రం, ఆదిత్య హృదయం.

The landing page also shows a daily Panchangam widget (sunrise/sunset,
Rahukalam, live clock) computed locally from the device's location, with a
Hyderabad fallback.

## Run it locally (to preview)
You can't just double-click `index.html` and get full install/offline behavior —
browsers block service workers on the `file://` protocol. Serve it over local HTTP:

```bash
cd telugu-ashtottaralu
python3 -m http.server 8000
# open http://localhost:8000 in your phone/desktop browser (same Wi-Fi, use your computer's IP for phone)
```

## Put it on the real internet (needed for "Add to Home Screen")
PWAs need to be served over **HTTPS** for install-to-homescreen and offline
caching to work on a phone. This repo is set up for GitHub Pages — see
[DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md). Netlify, Vercel, or Firebase
Hosting work too (drag-and-drop or CLI deploy).

Once it's live at an HTTPS URL, open it on your phone and:
- **Android/Chrome**: tap the menu → "Add to Home screen" / "Install app".
- **iPhone/Safari**: tap Share → "Add to Home Screen".

After the first visit, the service worker caches everything, so it keeps working
without internet.

## What's inside
- `index.html` / `styles.css` / `app.js` — app shell, bottom navigation, more menu, share, and the reading screen (with A-/A+ font size controls, persisted)
- `panchangam.js` — Panchangam widget logic (uses vendored `suncalc.js`)
- `data.js` — aggregator; lists deity order and points `DEITIES` at `window.DEITY_DATA`
- `data/<id>.js` — one file per deity, each populating `window.DEITY_DATA.<id>` with its Telugu/English names, tabs (names / verses / text), theme color, and symbol name
- `manifest.json` — makes it installable
- `service-worker.js` — caches the app shell for offline use (bump `CACHE_NAME` whenever a cached file's contents change)
- `icon-*.png` — app icons

Every deity is represented by an original line-art SVG "symbol" badge (defined
inline in `index.html`'s icon sprite, e.g. `icon-lotus`, `icon-conch`,
`icon-trishul`) rendered in the deity's own theme color — not a photo or
reproduction of existing artwork, so there's no image-licensing question to
track. Current symbols: flame, om, trishul, shiva, durga, modak, lotus,
conch, veena, gada, vel, dhanush, flute, bell, claw, kalasha, navagraha, surya.

## Adding more deities later
Create `data/<id>.js` following the pattern of an existing file — it should do:
```js
window.DEITY_DATA = window.DEITY_DATA || {};
window.DEITY_DATA.<id> = { "telugu": "...", "english": "...", "tabs": [...], "color": "...", "colorSoft": "...", "symbol": "<icon name>", "id": "<id>" };
```
If none of the existing symbols fit, add a new `<symbol id="icon-...">` to the
SVG sprite at the bottom of `index.html` (keep it simple original line art,
not a reproduction of an existing image/artwork).

Then:
1. Add `<id>` to `DEITY_ORDER` in `data.js`.
2. Add a `<script src="data/<id>.js"></script>` tag in `index.html`.
3. Add `./data/<id>.js` to `APP_SHELL` in `service-worker.js`, and bump `CACHE_NAME`.
