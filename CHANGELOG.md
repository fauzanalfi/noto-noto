# Changelog

All notable changes to this project are documented in this file.

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

- Lint passes (`npm run lint`).
- Build passes (`npm run build`).
- Test suite passes (`npm run test:run`).

## 2026-02-26

### Added

- Added `useNoteActions` custom hook to centralize note mutation logic.
- Added focused tests for note action behavior in `src/hooks/useNoteActions.test.js`.
- Added comprehensive technical documentation in `docs/APP_DOCUMENTATION.md`.

### Changed

- Refactored `useNotes` to delegate note mutations to `useNoteActions` while preserving the public hook API used by the app.
- Improved lint compliance across app, editor, sidebar, login, and hook modules.

### Quality

- Verified lint passes with `npm run lint`.
- Verified full test suite passes with `npm run test:run`.
