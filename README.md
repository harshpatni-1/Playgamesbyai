# The Game Shelf — Vercel-ready deployment

This is a static HTML project with four standalone rhythm-platform games. It needs no framework, CDN, assets, or runtime server. The package includes an explicit Vercel build so the deployment does not depend on an inherited Output Directory setting.

## Deploy to Vercel (recommended)

1. Extract this ZIP.
2. Upload the **contents** of this folder to the root of a GitHub repository. The repository root must directly contain `index.html`, `package.json`, `build.mjs`, `vercel.json`, `404.html`, and `games/`.
3. In Vercel, import that repository. Choose **Framework Preset: Other** (or let `vercel.json` set it), Build Command `npm run build`, Output Directory `dist`, and Install Command `npm install --ignore-scripts --no-audit --no-fund`. The checked-in `vercel.json` already specifies these values.
4. Deploy. The build script validates the four pages and copies the homepage plus `games/` into `dist/`.

If this Vercel project previously used a different app, check **Settings → Build & Development Settings → Root Directory**: it must point to the directory containing this `package.json`, not a parent folder or a `games` subfolder. Redeploy after changing it.

## Deploy with Vercel CLI

Install Node.js 20+, unzip this project, open a terminal in the folder containing `package.json`, then run:

```bash
npm run build
npx vercel --prod
```

Confirm the CLI uses this folder as the project root. A successful build prints `Build complete: 5 HTML files copied to .../dist`.

## Local preview

```bash
npm run build
npx serve dist
```

Or use any static file server pointed at `dist/`. The four game links are relative URLs, so keep `games/` beside `index.html` in the deployed output.

## Included games

- `games/grok-neon-pulse.html`
- `games/chatgpt-pulse-rift.html`
- `games/claude-neon-pulse.html`
- `games/gemini-cyber-pulse.html`

## What the build checks

- Root `index.html` exists.
- All four standalone game files exist.
- Homepage links reference all four game pages.
- `dist/` includes the homepage, game pages, and custom 404 page.
