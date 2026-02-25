# Noto App Documentation

## Overview

Noto is a Markdown-first note-taking app built around the PARA method:

- Inbox
- Projects
- Areas
- Resources
- Archive

The app is a single-page React application backed by Firebase Authentication and Cloud Firestore. It supports real-time sync, note organization, tagging, note export, and installable PWA behavior.

---

## Core Features

- Google sign-in with private per-user data
- PARA-based notebook organization
- Notes with title, content, tags, pin, trash, and restore flow
- Markdown editor with formatting toolbar and live preview
- Quick switcher (`Ctrl/Cmd + K`)
- New note shortcut (`Ctrl/Cmd + N`)
- Zen mode and responsive/mobile editing flow
- Export as Markdown (`.md` / `.zip`) and JSON backup

---

## Tech Stack

- React 19
- Vite 7
- Firebase Auth + Firestore
- Lucide React (icons)
- Marked + DOMPurify (Markdown rendering/sanitization)
- Vitest + Testing Library

---

## Application Architecture

### High-level flow

1. `useAuth` subscribes to auth state.
2. After sign-in, `useNotebooks` and `useNotes` subscribe to Firestore collections.
3. `App` composes UI state (active view, note selection, search, editor mode).
4. Write operations are handled with optimistic updates and rollback.
5. UI components are mostly presentational and receive callbacks via props.

### Main modules

- `src/App.jsx`: root composition and UI orchestration
- `src/hooks/useAuth.js`: authentication state + actions
- `src/hooks/useNotebooks.js`: notebook sync + mutations
- `src/hooks/useNotes.js`: note state, filters, and action wiring
- `src/hooks/useNoteActions.js`: note mutation logic (create/update/delete/etc.)
- `src/components/*`: editor, list, sidebar, toolbar, dialogs, menus
- `src/utils.js`: shared helpers, constants, export helpers

---

## Data Model

### Firestore collections

User-scoped collections under:

- `users/{userId}/notes`
- `users/{userId}/notebooks`

### Note shape

A note includes:

- `id`
- `title`
- `content`
- `notebookId`
- `tags` (array)
- `createdAt`
- `updatedAt`
- `pinned` (boolean)
- `trashed` (boolean)

### Notebook shape

A notebook includes:

- `id`
- `name`
- `color`
- `icon`
- `paraCategory`
- `createdAt`

Default PARA notebooks are seeded for each user.

---

## Hooks

### `useAuth`

Responsibilities:

- Subscribe to Firebase auth state
- Expose `user`
- Expose `signIn` (Google popup) and `signOut`

### `useNotebooks`

Responsibilities:

- Subscribe to notebook collection
- Seed default PARA notebooks when empty
- Expose notebook CRUD/move actions
- Keep local UI state in sync with Firestore updates

### `useNotes`

Responsibilities:

- Subscribe to notes collection (`updatedAt desc`)
- Seed a welcome note on first empty snapshot
- Expose derived values (`allTags`, filtered list)
- Expose note actions delegated from `useNoteActions`
- Manage loading/saving/error state

### `useNoteActions`

Responsibilities:

- Handle note mutation operations:
  - create
  - update (debounced)
  - trash/restore/permanent delete
  - empty trash
  - duplicate
  - pin toggle
  - move notebook
  - add/remove tag
- Apply optimistic updates and rollback on write failure
- Coordinate debounced update tokens/timers to avoid stale rollback

---

## UI Structure

- `Sidebar`: navigation, notebooks, tags, theme switch, user controls
- `NotesList`: filtered notes + search + create action
- `NoteToolbar`: note actions (pin/trash/move/export/view mode)
- `Editor`: Markdown input + formatting toolbar
- `Preview`: rendered Markdown preview
- `QuickSwitcher`: fast note navigation dialog
- `LoginScreen`: unauthenticated entry UI

---

## Keyboard Shortcuts

Global:

- `Ctrl/Cmd + N`: create note in current context
- `Ctrl/Cmd + K`: open/close quick switcher
- `Escape`: close quick switcher

Editor:

- `Ctrl/Cmd + B`: bold
- `Ctrl/Cmd + I`: italic
- `Tab`: indent
- `Shift + Tab`: unindent (current line context)

---

## State and Error Handling

- Optimistic updates are applied immediately to keep UI responsive.
- Failed writes trigger rollback when possible and set user-facing error state.
- `saving` indicates in-flight writes.
- Debounced note updates reduce Firestore write frequency while typing.

---

## Security Model

Expected Firestore rule pattern:

- Users can only read/write documents under their own `users/{userId}` path.

Recommended rule snippet is documented in the root README.

---

## Environment Configuration

Create a `.env` with:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## Commands

- Development: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Test (watch): `npm run test`
- Test (once): `npm run test:run`
- Test UI: `npm run test:ui`

---

## Testing Strategy

Current tests focus on:

- Utility helpers (`src/utils.test.js`)
- Generic hook behavior (`src/hooks/useDebounce.test.js`)
- Note action orchestration (`src/hooks/useNoteActions.test.js`)

When extending features, prefer tests for:

- optimistic update + rollback behavior
- debounced save behavior
- filtering and derived-state correctness

---

## Recent Internal Changes

- Introduced `useNoteActions` to centralize note mutation logic.
- Refactored `useNotes` to delegate actions while preserving external API.
- Added focused tests for `useNoteActions`.
- Cleaned lint issues across app and hook modules.

---

## Deployment

See the full deployment guide in `DEPLOYMENT.md` for Vercel, Netlify, GitHub Pages, Docker, VPS, and Cloudflare options.
