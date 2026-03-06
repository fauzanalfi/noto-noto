# Developer Guide: Do's and Don'ts

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Design Tokens

| ✅ Do | ❌ Don't |
|---|---|
| Use `var(--color-danger)` for destructive actions | Hardcode `#ef4444` or any hex value in component styles |
| Use semantic tokens like `--bg-primary`, `--text-accent` | Use raw brand tokens like `--purple-400` directly in components |
| Add new tokens to `:root` and all three `[data-theme]` blocks simultaneously | Add a token to only one theme block |
| Reference `var(--font-size-sm)` for label text | Write `font-size: 0.875rem` inline |
| Use `var(--space-md)` for padding | Write `padding: 12px` |

---

## 2. CSS

| ✅ Do | ❌ Don't |
|---|---|
| Write all component styles in `src/index.css` | Create separate CSS files per component |
| Use flat, BEM-like class names (`.note-card`, `.note-card-title`) | Use deep nesting or overly generic names (`.card`, `.title`) |
| Apply state via `.active`, `.open`, `.disabled` classes | Use inline styles for state-based styling (except dynamic values) |
| Use `transition: all var(--transition-fast)` for interactive elements | Use pixel `ms` values in `transition` |
| Use `var(--radius-md)` on containers | Mix `border-radius: 6px` and `8px` ad hoc |
| Test all three themes after adding styles | Only test the default dark theme |

---

## 3. Components

| ✅ Do | ❌ Don't |
|---|---|
| Wrap icon-only buttons with `aria-label` | Render `<button><Icon /></button>` with no accessible name |
| Use `<button>` for interactive elements | Use `<div onClick>` for actions |
| Use semantic HTML (`<nav>`, `<ul>`, `<main>`) | Compose layouts entirely from `<div>` |
| Keep component CSS classes co-located (named after the component) | Add component-specific styles to unrelated sections |
| Document new components in `docs/design-system/03-components/` | Ship undocumented UI patterns |

---

## 4. Accessibility

| ✅ Do | ❌ Don't |
|---|---|
| Check color contrast with a contrast checker | Assume a color "looks fine" |
| Use `aria-live="polite"` on non-critical dynamic regions | Use `aria-live="assertive"` for everything |
| Trap focus inside modals and dialogs | Let focus escape outside open modals |
| Return focus to the trigger element when closing a modal | Leave focus at `<body>` after modal close |
| Use `:focus-visible` — already global in `index.css` | Add `outline: none` to focusable elements |

---

## 5. Animation

| ✅ Do | ❌ Don't |
|---|---|
| Use `var(--transition-fast)` for micro-interactions | Hard-code `transition: 120ms ease` |
| Respect `prefers-reduced-motion` (global override already in CSS) | Add `@keyframes` that don't collapse under reduced motion |
| Use `var(--anim-fade-in)` for overlay appearances | Animate overlays with JS `setTimeout` style tricks |
| Keep hover transitions to `--transition-fast` (120ms) | Use `500ms+` for hover state changes |

---

## 6. Firebase / Data

| ✅ Do | ❌ Don't |
|---|---|
| Use `useNoteActions` hook for all note CRUD operations | Call Firestore directly from component event handlers |
| Debounce editor changes before saving (1000 ms via `useDebounce`) | Save on every single keystroke |
| Show the Save Indicator during any async save operation | Silently save without any visual feedback |
| Handle Firestore errors and show `--color-danger` feedback | Silently swallow errors with empty `catch {}` |

---

## 7. PARA System

| ✅ Do | ❌ Don't |
|---|---|
| Use `var(--para-{category})` for PARA dots | Use arbitrary colors for notebooks |
| Keep PARA categories flat (5 fixed categories) | Create sub-categories or user-defined categories |
| Default new notebooks to `inbox` PARA category | Create notebooks with no PARA category |
| Show PARA color dots consistently in sidebar and move menus | Mix colored dots with colored backgrounds |

---

## 8. Performance

| ✅ Do | ❌ Don't |
|---|---|
| Use `React.memo` only when profiling shows a measurable benefit | Wrap every component in `memo` preemptively |
| Virtualise the NotesList when note count exceeds ~200 | Render unbounded lists without virtualization |
| Lazy-load the KanbanBoard and TasksView routes | Eagerly import all views at startup |
| Use `useDebounce` for search and save operations | Trigger async operations on every render cycle |

---

## 9. Code Style

| ✅ Do | ❌ Don't |
|---|---|
| Use named exports for components | Use default anonymous arrow function exports |
| Co-locate test files with source files (`*.test.js`) | Put all tests in a separate top-level `__tests__/` folder |
| Write pure utility functions in `src/utils.js` | Embed business logic in component render functions |
| Use Lucide React icons at 14/16/18/20px sizes | Scale Lucide icons to arbitrary sizes or mix icon libraries |
