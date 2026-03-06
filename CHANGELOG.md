# Changelog

All notable changes to this project are documented in this file.

## v2.0.0 - 2026-03-06

### Added

- **Design system** — Fully documented W3C DTCG token set covering colour (dark/light/eyecare themes), typography, spacing, motion, elevation, and grid; maintained in `docs/design-system/`.
- **Onboarding flow** (`src/components/Onboarding.jsx`) — 3-step first-run modal: Welcome, Create your first notebook (with PARA category picker), and Quick Switcher intro. Completion state persisted in `localStorage('noto-onboarded')`.
- **Settings modal** (`src/components/Settings.jsx`) — 2-pane overlay with four sections: Account (avatar, email, sign-out), Appearance (theme picker), Editor (auto-save info, font details), and About (version, full keyboard shortcuts table).
- **Mobile bottom tab bar** — Persistent `<nav role="tablist">` on small screens with tabs for Notes, Kanban, Tasks, and Settings; replaces reliance on the sidebar for primary mobile navigation.
- **Expanded keyboard shortcuts** — `⌘1`–`⌘4` to switch view modes and toggle Zen mode; `⌘S` flashes a saved confirmation; `⌘F` focuses the search box; `Esc` dismisses overlays in priority order (Quick Switcher → Settings → Zen mode).
- **Save indicator accessibility** — `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` on the save indicator; `.saved` and `.error` CSS state variants.
- **New animation keyframes** — `modalIn` (scale 0.96 → 1), `quickSwitcherIn` (fade + translateY -8px), `loginCardIn`, `tagIn`, `cardDropSpring`.

### Changed

- **Login screen** — Complete redesign from two-panel hero layout to a single centred card with wordmark (`noto.`), tagline, and ambient background blobs.
- **Layout tokens** — Sidebar width 260 px → 240 px; notes list width 320 px → 300 px; toolbar height 48 px → 44 px.
- **Quick Switcher** — Position changed to `top: 20vh`; width set to `min(560px, 90vw)`; now uses `quickSwitcherIn` spring animation on open.
- **Modal animation** — Upgraded from plain `slideUp` to `modalIn` (scale + fade) across all modal overlays.
- **Sidebar footer** — Sign-out button replaced by a gear icon that opens the new Settings modal; sign-out moved inside Settings → Account.
- **Toolbar view mode buttons** — Titles updated to include keyboard hints, e.g. `"Edit only (⌘1)"`.
- **Inter font** — Weight range extended to include `800` for display headings.
- **Page title** — Updated to "Noto 2.0 — Your Second Brain".
- **Kanban** — Column width changed to `min(280px, 85vw)`; card background set to `--bg-primary`; dragging card applies `scale(1.02)` lift.
- **Zen mode** — Editor constrained to `max-width: 720px` centred; chrome elements fade when cursor is idle.
- **Tag pill** — Entrance animated with `tagIn` (200 ms).

### Quality

- Verified lint passes (`npm run lint`).
- Verified build passes (`npm run build`).
- Deployed to Vercel (`vercel --prod`).

---

## v1.0.1 - 2026-03-01

### Added

- Added four editor view modes: `edit`, `split-horizontal`, `split-vertical`, and `preview`.
- Added explicit split orientation controls in the note toolbar (left/right and top/bottom).

### Changed

- Updated split rendering logic to support top/bottom orientation across desktop and mobile/tablet.
- Updated Kanban workspace layout so Kanban is wider than notes/editor (target ~70/30 on larger screens).
- Updated feature copy in README, app documentation, and login screen to reflect flexible split preview.

### Fixed

- Fixed mobile editor back button behavior so it is visible and functional from the toolbar.
- Fixed Notes view scrolling on mobile by correcting panel flex/min-height constraints.
- Fixed mobile FAB clipping by adding safe-area-aware bottom spacing.

### Quality

- Verified build passes (`npm run build`).

## v1.0.0 - 2026-02-26

### Added

- Added `useNoteActions` hook to centralize note mutation logic.
- Added focused tests for note action behavior in `src/hooks/useNoteActions.test.js`.
- Added comprehensive technical documentation in `docs/APP_DOCUMENTATION.md`.
- Added GitHub Actions secret scanning workflow using Gitleaks.

### Changed

- Updated deployment to GitHub Pages with automated workflow.
- Introduced demo mode for GitHub Pages using localStorage (no Firebase/Google OAuth dependency).
- Refactored notes/notebooks flows for safer public demo behavior.
- Updated README live demo link to GitHub Pages.

### Fixed

- Fixed GitHub Pages runtime error `auth/invalid-api-key` by adding demo fallback runtime.
- Fixed icon and manifest 404 issues on GitHub Pages subpath deployment.

### Quality

- Verified lint passes (`npm run lint`).
- Verified build passes (`npm run build`).
- Verified test suite passes (`npm run test:run`).

