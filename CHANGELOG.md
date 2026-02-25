# Changelog

All notable changes to this project are documented in this file.

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
