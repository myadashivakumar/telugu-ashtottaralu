# Deploy to GitHub Pages (free, HTTPS, works for "Add to Home Screen")

## Option A — GitHub website only (no git command line needed)
1. Go to github.com → **New repository** (e.g. name it `ashtottaralu`). Keep it Public.
2. Click **Add file → Upload files**, then drag in *every file* from this
   folder (including the hidden `.nojekyll` file — if GitHub's uploader
   hides it, that's fine, it's optional but recommended).
3. Commit the files (straight to `main` is fine).
4. Go to **Settings → Pages**.
5. Under "Build and deployment", set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**. Save.
6. Wait ~1 minute, then your app is live at:
   `https://<your-username>.github.io/ashtottaralu/`

## Option B — git command line
```bash
cd telugu-ashtottara-pwa
git init
git add .
git commit -m "Telugu Ashtottara Shatanamavali PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/ashtottaralu.git
git push -u origin main
```
Then enable Pages the same way as step 4–5 above.

## After it's live
Open the `github.io` link on your phone:
- **Android/Chrome**: menu (⋮) → "Add to Home screen" / "Install app"
- **iPhone/Safari**: Share icon → "Add to Home Screen"

It'll then work offline — the service worker caches the app and all 108-name
lists on first load.

## Note on the URL path
Because GitHub Pages serves your repo at a *sub*-path
(`username.github.io/repo-name/`, not the domain root), everything in this
app already uses relative paths (`./index.html`, `./styles.css`, etc.) so it
works correctly there without any changes.
