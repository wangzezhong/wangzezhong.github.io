# Fitts' Law · Interactive Data Comic

Single-page React app teaching Fitts' Law through 8 interactive panels: prediction, measurement, visualization, regression against lab values, and design applications.

Built as an HCI teaching artifact / job demo.

---

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/fitts-comic/` (or whatever port Vite picks).

> The path `/fitts-comic/` is the repo-name prefix from `vite.config.js`. If you rename the repo, see "Customize the URL" below.

---

## Deploy to GitHub Pages

This repo ships with a GitHub Actions workflow that auto-builds and deploys on every push to `main`.

### One-time setup

1. **Push this code to a new GitHub repo**

   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/fitts-comic.git
   git push -u origin main
   ```

2. **Enable Pages with GitHub Actions as the source**

   - Go to your repo on GitHub
   - Settings → Pages
   - Under **Build and deployment**, set **Source** to **GitHub Actions**
   - That's it. No branch to choose, no folder to configure.

3. **First push triggers the workflow**

   The `.github/workflows/deploy.yml` already exists. The workflow runs on every push to `main`. Watch progress under the repo's **Actions** tab.

   When it finishes (~2 min), your site is live at:

   ```
   https://<YOUR_USERNAME>.github.io/fitts-comic/
   ```

---

## Customize the URL (rename the repo)

If you want a different repo name like `hci-demo` instead of `fitts-comic`, change BOTH of these:

1. **The repo name on GitHub** (rename in repo Settings, or create with the new name)
2. **`vite.config.js`** — change `base: "/fitts-comic/"` to `base: "/<NEW_NAME>/"`

The trailing slash matters. Without it, asset paths break.

---

## Linking from your personal homepage

If your personal site is at `https://<YOUR_USERNAME>.github.io/`, you can link to the comic with a simple anchor:

```html
<a href="/fitts-comic/">Fitts' Law · Interactive Data Comic</a>
```

Or absolute:

```html
<a href="https://<YOUR_USERNAME>.github.io/fitts-comic/">…</a>
```

The two repos are independent. Your personal site stays at the user-page URL; this lives under it as a project page.

---

## Project structure

```
fitts-comic/
├── .github/workflows/deploy.yml     # Auto-deploy on push
├── index.html                       # Vite entry (mounts on #root)
├── package.json                     # Vite + React 18, no other deps
├── vite.config.js                   # base URL for GitHub Pages
└── src/
    ├── main.jsx                     # React mount
    ├── index.css                    # Minimal global reset
    └── FittsLawComic.jsx            # The whole comic (8 panels, ~3900 lines)
```

The comic is one self-contained component. All styling is inline + a single `<style>` block inside the component, so no Tailwind / no CSS-in-JS library needed.

---

## Local production preview

To verify the production build before pushing:

```bash
npm run build
npm run preview
```

This serves the static `dist/` folder exactly as GitHub Pages will.

---

## Tech

- React 18
- Vite 5
- No Tailwind, no shadcn, no router. The comic is a single scroll page.

---

## License

MIT (or pick your own — edit this section).
