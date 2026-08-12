# అష్టోత్తర శతనామావళి — Telugu Ashtottara PWA

A installable, offline-capable app with the 108-name (అష్టోత్తర శతనామావళి) prayer
for seven deities: గణేశ, విష్ణు, శివ, మహాలక్ష్మి, దుర్గ, సరస్వతి, హనుమాన్.

## Run it locally (to preview)
You can't just double-click `index.html` and get full install/offline behavior —
browsers block service workers on the `file://` protocol. Serve it over local HTTP:

```bash
cd telugu-ashtottara-pwa
python3 -m http.server 8000
# open http://localhost:8000 in your phone/desktop browser (same Wi-Fi, use your computer's IP for phone)
```

## Put it on the real internet (needed for "Add to Home Screen")
PWAs need to be served over **HTTPS** for install-to-homescreen and offline
caching to work on a phone. Easiest free options — just upload this folder:

- **GitHub Pages**: create a repo, push these files, enable Pages in repo settings.
- **Netlify / Vercel**: drag-and-drop this folder into their web dashboard (free tier).
- **Firebase Hosting**: `firebase init hosting` then `firebase deploy`.

Once it's live at an HTTPS URL, open it on your phone and:
- **Android/Chrome**: tap the menu → "Add to Home screen" / "Install app".
- **iPhone/Safari**: tap Share → "Add to Home Screen".

After the first visit, the service worker caches everything, so it keeps working
without internet.

## What's inside
- `index.html` / `styles.css` / `app.js` — the app shell and UI
- `data.js` — all 7 deities' 108 names in Telugu (sourced and cross-checked
  against Vaidika Vignanam's Telugu ashtottara texts)
- `manifest.json` — makes it installable
- `service-worker.js` — caches the app for offline use
- `icon-*.png` — app icons (a simple diya/lamp motif)

## Adding more deities later
Open `data.js` — each deity is an object with `telugu`, `english`, `color`,
`colorSoft`, `symbol` (one of: om, trishul, lotus, conch, veena, gada), and a
`names` array of exactly 108 strings. Add a new entry and its id to
`DEITY_ORDER`, then add its filename to `service-worker.js`'s cache list if
you add new assets.
