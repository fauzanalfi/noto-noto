# Data Entry Patterns

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Data entry in Noto is intentionally minimal. The primary input surface is the full-screen Markdown editor. Secondary inputs appear in modals (notebook creation/rename), the tag row, search, and settings. This document defines the interaction rules and visual conventions for all input surfaces.

---

## 2. Inline Editing

Inline editing allows users to edit content without opening a separate modal.

| Context | Trigger | Commit | Cancel |
|---|---|---|---|
| Note title | Click title in editor toolbar breadcrumb | `Enter` or blur | `Esc` |
| Notebook rename | Right-click → Rename in sidebar | `Enter` or blur | `Esc` |
| Tag add | Click "+ Add tag" pill | `Enter` or comma | `Esc` |
| Kanban card title | Double-click card | `Enter` or blur | `Esc` |

All inline inputs follow the pattern: replace static text with `<input>` → apply `.editing` class to parent → auto-select content for easy replacement.

---

## 3. Modal Forms

Used for destructive confirmations, notebook creation, and settings panels.

**Structure:**
1. Modal header: clear task statement ("Create notebook", "Delete note?")
2. Body: form fields with labels above inputs
3. Footer: primary CTA on right, cancel on left

Labels are always visible — never use placeholder-as-label.

---

## 4. The Editor as Primary Input

The Markdown editor (`Editor.jsx`) is the core data-entry surface. Design rules:

| Principle | Implementation |
|---|---|
| **Zero distractions** | Toolbar hidden in Zen mode; chrome minimised |
| **Auto-save** | Save on every keystroke, debounced 1 s via `useDebounce` |
| **Focus line** | Monospace font in code blocks; serif/sans for prose |
| **Typewriter mode** (future) | Keep active line at viewport midpoint |

The editor `<textarea>` has no border, no outline, no visible chrome — it is pure surface.

---

## 5. Search Input Behaviour

1. Search box is always visible at top of NotesList.
2. Filtering is **live** — results update on every keystroke (debounced 300 ms).
3. Empty query → show all notes in the selected notebook.
4. Active query → show filtered results across notebook.
5. `Esc` clears the query and restores full list.
6. Keyboard shortcut `⌘F` / `Ctrl+F` focuses the search box from anywhere in the app.

---

## 6. Validation

Noto's inputs are low-stakes. Validation rules:

| Input | Rule |
|---|---|
| Notebook name | Required; max 80 chars; trimmed |
| Note title | Optional; max 200 chars; falls back to "Untitled" |
| Tag | Max 30 chars; alphanumeric + hyphens only; duplicates silently ignored |
| Search query | No validation — any string is valid |

Validation errors appear as a red helper text below the input using `--color-danger` and `--font-size-xs`. Never replace the label with an error.

---

## 7. Destructive Actions

Destructive actions (delete note, delete notebook, empty trash) follow a two-step confirmation pattern:

1. **Step 1:** User triggers the action (context menu or button).
2. **Step 2:** Confirmation modal appears with:
   - Clear title stating what will be destroyed
   - Description of consequence ("This cannot be undone.")
   - Cancel button (default focus)
   - Destructive primary button (red, `btn-danger`)

The default focus is on Cancel to prevent accidental confirmation via `Enter` key.

---

## 8. Auto-save Indicator Integration

The save state flows through the `useNoteActions` hook and surfaces in the Save Indicator component in the toolbar. The save cycle is:

```
User types
   ↓ (immediate)
Set saveStatus = 'saving'
   ↓ (debounce 1000ms)
Call Firestore .set()
   ↓ (on resolve)
Set saveStatus = 'saved'
   ↓ (after 2000ms)
Clear saveStatus
```

On Firestore error → set `saveStatus = 'error'` and show persistent error chip.
