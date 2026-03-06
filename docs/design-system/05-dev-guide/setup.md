# Developer Guide: Setup

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 20 (LTS) |
| npm | ≥ 10 |
| Git | Any recent version |

---

## 2. Installation

```bash
git clone https://github.com/your-org/noto-noto.git
cd noto-noto
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the project root (copy from `.env.example` if provided):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These map to `src/firebase.js`. Without them, Firebase init will throw and the app will not start.

---

## 4. Development Server

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`. Hot module replacement (HMR) is enabled.

---

## 5. Build & Preview

```bash
npm run build      # Production build → dist/
npm run preview    # Serve the dist/ build locally
```

---

## 6. Tests

```bash
npm test           # Run Vitest in watch mode
npm run test:run   # Run once (CI mode)
```

Test files:
- `src/utils.test.js`
- `src/hooks/useDebounce.test.js`
- `src/hooks/useNoteActions.test.js`
- Test setup: `src/test/setup.js`

---

## 7. Project Structure

```
src/
  App.jsx              — Root layout + state
  firebase.js          — Firebase initialisation
  index.css            — ✦ Entire design system (tokens + components)
  main.jsx             — React entry point
  utils.js             — Pure utility functions
  components/          — All React components
  hooks/               — Custom hooks (auth, notes, notebooks, theme, debounce)
  assets/              — Static assets (icons, images)
docs/
  design-system/       — This design system documentation
    01-foundations/    — Color, typography, spacing, grid, elevation, motion
    02-tokens/         — tokens.json (W3C DTCG)
    03-components/     — 32 component specs
    04-patterns/       — Navigation, data entry, content display, PARA
    05-dev-guide/      — This section
    06-ui-design.md    — Full UI design (wireframes + specs)
    index.md           — Master table of contents
```

---

## 8. CSS Architecture

The **entire design system lives in `src/index.css`**. There are no CSS modules, no Tailwind, no styled-components.

Working with styles:
- All design tokens are CSS custom properties on `:root`.
- Theme overrides live in `[data-theme="light"]` and `[data-theme="eyecare"]` blocks.
- Component styles are flat BEM-like classes.
- Responsive breakpoints: `768px` (mobile → tablet) and `1024px` (tablet → desktop).

### Adding a new component

1. Add the base class styles to `src/index.css` under the appropriate section comment.
2. Use only existing design tokens — never hardcode color, size, or spacing values.
3. Add a new spec file to `docs/design-system/03-components/`.
4. Update `docs/design-system/03-components/_index.md` table.

---

## 9. Linting

```bash
npm run lint       # Run ESLint
```

Config: `eslint.config.js`.

---

## 10. Deployment

See [DEPLOYMENT.md](../../DEPLOYMENT.md) for full Vercel deployment instructions.

Quick start:
1. Push to `main`.
2. Vercel auto-deploys from the `dist/` build via `vercel.json` config.
