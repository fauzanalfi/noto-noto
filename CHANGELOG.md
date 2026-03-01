# Changelog

All notable changes to this project are documented in this file.

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

