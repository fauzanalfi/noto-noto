# CLAUDE.md — AI Assistant Guide for Noto 2.0

This file provides context and conventions for AI assistants (Claude Code and similar tools) working on the Noto 2.0 codebase.

## Project Overview

**Noto 2.0** is a React + Firebase note-taking application implementing the [PARA method](https://fortelabs.com/blog/para/) (Projects, Areas, Resources, Archive). It supports real-time sync, Markdown editing, Kanban boards, PWA offline support, and a demo mode (localStorage fallback for GitHub Pages deployments).

- **Live Demo**: GitHub Pages (demo mode, no Firebase required)
- **Production**: Vercel deployment with Firebase backend
- **License**: MIT

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Plain CSS (W3C DTCG design tokens) |
| Icons | Lucide React |
| Auth | Firebase Auth (Google OAuth) |
| Database | Firestore (real-time sync) |
| Markdown | marked + DOMPurify |
| Syntax Highlighting | highlight.js |
| Testing | Vitest 2 + React Testing Library |
| Build | Vite 7 |
| Linting | ESLint 9 (flat config) |
| Deployment | Vercel (primary), GitHub Pages |
| PWA | Service worker for offline support |
| Exports | jszip |

---

## Repository Structure

```
noto-noto/
├── .github/
│   ├── ISSUE_TEMPLATE/         # Bug & feature request templates
│   ├── workflows/
│   │   ├── deploy-gh-pages.yml # Deploys to GitHub Pages (demo mode)
│   │   └── gitleaks.yml        # Secret scanning
│   ├── CODE_OF_CONDUCT.md
│   ├── SECURITY.md
│   └── pull_request_template.md
├── docs/design-system/         # Design system documentation
├── public/                     # Static assets, PWA manifest
├── src/
│   ├── components/             # 18 React components
│   ├── context/
│   │   ├── NotesContext.jsx    # Data layer (auth, notes, notebooks)
│   │   └── UIContext.jsx       # Presentation layer (views, modals, shortcuts)
│   ├── hooks/
│   │   ├── useNotes.js         # Firestore real-time listener + CRUD
│   │   ├── useNoteActions.js   # Note operations (create/update/delete/move)
│   │   ├── useAuth.js          # Firebase Auth + demo mode
│   │   ├── useTheme.js         # Theme management (dark/light/eye-care)
│   │   └── useDebounce.js      # Debounce utility hook
│   ├── test/
│   │   ├── setup.js            # jest-dom matchers setup
│   │   ├── useDebounce.test.js
│   │   ├── useNoteActions.test.js
│   │   └── utils.test.js
│   ├── index.css               # All styles + design tokens (single file, 2974 lines)
│   ├── App.jsx                 # Root component
│   ├── AppLayout.jsx           # Main layout orchestrator
│   ├── firebase.js             # Firebase client initialization
│   ├── runtime.js              # Demo mode detection
│   ├── utils.js                # Shared utilities
│   └── main.jsx                # Vite entry point
├── .env.example                # Required environment variables
├── CHANGELOG.md
├── CONTRIBUTING.md             # Bilingual (EN/ID) contribution guide
├── DEPLOYMENT.md               # 12-option deployment guide
├── eslint.config.js            # ESLint v9 flat config
├── vite.config.js
├── vercel.json                 # SPA routing (all → index.html)
└── package.json
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run tests (watch mode)
npm test

# Run tests (CI, single run)
npm run test:run

# Run tests with interactive UI
npm run test:ui
```

---

## Environment Setup

Copy `.env.example` to `.env` and fill in Firebase credentials:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

If any Firebase variable is missing, the app automatically enters **demo mode** (localStorage-based, no auth required). This is the default behavior for GitHub Pages deployments where `VITE_DEMO_MODE=true`.

---

## Architecture & Key Patterns

### Two-Context State Management

State is split into two React contexts to separate concerns:

- **`NotesContext`** (`src/context/NotesContext.jsx`): Data layer — auth state, notes array, notebooks, CRUD operations, derived counts (pinned, trashed, tasks).
- **`UIContext`** (`src/context/UIContext.jsx`): Presentation layer — active view, search query, editor mode, open modals, keyboard shortcuts, mobile detection.

Never put data-fetching logic in UIContext, and never put UI state in NotesContext.

### Custom Hooks

All Firestore interactions and side-effectful logic live in hooks, not components:

- `useNotes` — real-time `onSnapshot` listener, optimistic updates with rollback, debounced writes
- `useNoteActions` — note CRUD with error handling and rollback
- `useAuth` — Google OAuth + demo mode localStorage user
- `useTheme` — theme persistence via localStorage + `data-theme` attribute

### Demo Mode

Controlled by `src/runtime.js`. When Firebase config is incomplete or `VITE_DEMO_MODE=true`:
- localStorage keys: `noto-demo-notes-{userId}`, `noto-demo-user`
- Same data structure as Firestore — no code path changes in components
- Welcome notes are seeded on first run

### Firestore Data Model

```
/users/{userId}/notes/{noteId}
  id: string (UUID)
  title: string
  content: string (markdown)
  notebookId: string
  tags: string[]
  createdAt: ISO string
  updatedAt: ISO string
  pinned: boolean
  trashed: boolean
  status: "backlog" | "in-progress" | "done"

/users/{userId}/notebooks/{notebookId}
  id: string
  name: string
  color: string (hex)
  icon: string
  category: "inbox" | "projects" | "areas" | "resources" | "archive"
```

**Firestore Security Rule** (must be applied in Firebase console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Design System & Styling

All styles live in a **single file**: `src/index.css` (2974 lines). There are no CSS modules or CSS-in-JS.

Structure:
1. W3C DTCG design tokens as CSS custom properties (`--color-*`, `--spacing-*`, etc.)
2. Theme variables per `[data-theme]` attribute (`dark`, `light`, `eye-care`)
3. Global resets and base styles
4. Component styles ordered by layout hierarchy

**Theme tokens** to be aware of:
- `--color-bg-primary` — main background
- `--color-text-primary` — main text
- `--color-accent` — purple accent (#7c6aef dark / #6a5adc light)
- `--spacing-xs` through `--spacing-4xl` — 8-point grid (4px–64px)
- `--radius-sm` through `--radius-xl` — border radii

**When editing styles**: always use existing CSS variables. Do not hardcode colors or spacing values.

### Component Conventions

- Components are function components using hooks — no class components
- Stateless presentation components receive props; stateful components use context
- The `AppLayout.jsx` component is the top-level layout orchestrator
- Error boundaries are implemented in `ErrorBoundary.jsx`
- Use `lucide-react` for all icons (not emoji or other icon libraries)

### Keyboard Shortcuts

Managed in `UIContext.jsx` via a global `window` event listener:

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Toggle Quick Switcher |
| `Cmd/Ctrl + N` | New note |
| `Cmd/Ctrl + S` | Save note |
| `Cmd/Ctrl + F` | Focus search |
| `Cmd/Ctrl + 1–4` | Switch view |
| `Escape` | Close modal / exit Zen mode |

When adding new shortcuts: check for input-context awareness (shortcuts skip when focus is inside an `<input>` or `<textarea>`).

---

## Code Conventions

### JavaScript / JSX

- ES Modules throughout (`import`/`export`) — no CommonJS
- React 19 — use modern patterns (no legacy `componentDidMount` etc.)
- No TypeScript — plain `.js` and `.jsx` files
- Destructure props at function signature level
- Prefer `const` over `let`; never use `var`
- UUID generation via `crypto.randomUUID()` (with fallback in `utils.js`)

### File Naming

- Components: `PascalCase.jsx` (e.g., `NotesList.jsx`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useNoteActions.js`)
- Utilities: `camelCase.js` (e.g., `utils.js`)
- Tests: same name as file under test with `.test.js` suffix

### Commit Messages (Conventional Commits)

```
feat: add export to PDF feature
fix: resolve Kanban card drag-drop on mobile
docs: update deployment guide for Cloudflare Pages
style: remove unused CSS variables
refactor: extract search logic into custom hook
test: add coverage for useNoteActions
chore: update firebase to v12.9.0
```

### Branch Naming

```
feat/short-description
fix/issue-description
docs/what-is-documented
chore/task-description
```

---

## Testing

Tests use **Vitest** with **React Testing Library**. The test environment is JSDOM.

- Test files live alongside source (`src/test/` directory)
- Setup file: `src/test/setup.js` — imports `@testing-library/jest-dom`
- Current test coverage: hooks and utilities (not components)

When writing new tests:
- Mock Firebase with `vi.mock('../firebase')`
- Use `renderHook` from `@testing-library/react` for hook tests
- Use `act()` when state updates occur asynchronously

---

## Common Tasks

### Adding a New Component

1. Create `src/components/ComponentName.jsx`
2. Import and use context via `useContext(NotesContext)` or `useContext(UIContext)`
3. Use existing CSS variables — do not add new root-level CSS variables unless truly needed
4. Use `lucide-react` for any icons

### Adding a New View

1. Add a view identifier to `UIContext.jsx`'s `activeView` state
2. Add routing logic in `AppLayout.jsx`
3. Create the view component in `src/components/`
4. Add keyboard shortcut if needed in `UIContext.jsx`

### Adding a New Note Field

1. Update the note creation logic in `useNoteActions.js`
2. Update the Firestore listener/mapper in `useNotes.js`
3. Update any relevant UI components

### Modifying Themes

1. All theme variables are in `src/index.css` under `[data-theme="dark"]`, `[data-theme="light"]`, `[data-theme="eye-care"]` selectors
2. The `useTheme.js` hook handles persistence
3. Test all three themes after changes

---

## Deployment Notes

- **Vercel** (recommended): Connect repo, set Firebase env vars, auto-deploys on push to `main`
- **GitHub Pages**: CI workflow in `.github/workflows/deploy-gh-pages.yml` — sets `VITE_DEMO_MODE=true` and `VITE_BASE_PATH=/noto-noto/`
- **Docker / VPS**: See `DEPLOYMENT.md` for full instructions

The `vercel.json` rewrites all routes to `index.html` for SPA routing.

---

## Security Considerations

- Never commit `.env` — it is gitignored
- Firebase API keys in `.env.example` are client-side (public) keys — they are safe to expose, but Firestore security rules are the actual access control layer
- DOMPurify sanitizes all rendered Markdown to prevent XSS
- Gitleaks secret scanning runs on every push via GitHub Actions
- See `.github/SECURITY.md` for the vulnerability reporting policy

---

## What NOT to Do

- Do not add CSS-in-JS or CSS modules — all styles go in `src/index.css`
- Do not hardcode color or spacing values — use design tokens
- Do not add class components — function components only
- Do not add new icon libraries — use `lucide-react`
- Do not put data-fetching logic in UIContext
- Do not put UI state in NotesContext
- Do not push Firebase credentials to the repository
- Do not use `npm run build` to validate changes — run `npm run lint` and `npm run test:run` instead
