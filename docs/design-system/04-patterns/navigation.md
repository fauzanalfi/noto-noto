# Navigation Patterns

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Noto uses a persistent **three-column shell** as its primary navigation structure. The left column is the Sidebar (notebook list), the middle column is the NotesList panel, and the right column is the Editor. Navigation is driven by progressive disclosure: select a category → select a notebook → select or create a note.

---

## 2. Shell Layout

```
┌── Sidebar (240px) ──┬── NotesList (280–320px) ──┬── Editor (flex 1) ──┐
│  Logo               │  Search                    │  Toolbar             │
│  [PARA sections]    │  [Note cards]              │  [Title input]       │
│  [Notebooks]        │  [Sort/filter bar]         │  [Editor/Preview]    │
│  ─────              │  [Empty state]             │  [Tag row]           │
│  User avatar        │                            │                      │
└─────────────────────┴────────────────────────────┴──────────────────────┘
```

---

## 3. Responsive Navigation Modes

| Mode | Breakpoint | Behaviour |
|---|---|---|
| **Three-column** | >1024px | All three columns visible simultaneously |
| **Two-column** | 768–1024px | Sidebar hidden (drawer overlay); NotesList + Editor visible |
| **Single-column** | <768px | One panel at a time; back/forward navigation between panels |

### Mobile Navigation Stack

On mobile, the three columns become three stacked screens in a navigation stack:

```
[Home → notebooks list]  →  [Notes list]  →  [Editor]
       ←Back                     ←Back
```

The Back button appears in the toolbar when the user drills into the Editor.

---

## 4. Sidebar Collapse

On tablet, the Sidebar collapses to an icon-only rail (if implemented) or hides entirely into a drawer opened by the `Menu` button.

Sidebar open state is persisted in `localStorage` under `sidebarOpen`.

---

## 5. PARA Navigation Flow

```
[Sidebar: PARA category header]
    → [Notebook list within that category]
        → [NotesList: notes in selected notebook]
            → [Editor: active note]
```

The sidebar indicates the active PARA category (e.g., "Projects") with a subtle group highlight, and the active notebook with the active bar indicator.

---

## 6. Quick Switcher

The Quick Switcher (`⌘K` / `Ctrl+K`) is the keyboard-first shortcut that bypasses the hierarchy entirely — users can jump from any screen to any note in 1–2 keystrokes.

See the [Quick Switcher component spec](../03-components/quick-switcher.md).

---

## 7. Keyboard Navigation Map

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open Quick Switcher |
| `⌘N` / `Ctrl+N` | New note in current notebook |
| `⌘←` / `Alt+←` | Go back in navigation (mobile) |
| `⌘1–4` | Switch editor view mode |
| `Tab` | Move focus between Sidebar → NotesList → Editor |
| `↑` / `↓` | Navigate note cards within NotesList |
| `Enter` | Open focused note card |
| `Esc` | Close modal / dismiss Quick Switcher / return focus to list |

---

## 8. Focus Management Rules

1. When a note is selected from the NotesList, focus moves to the Editor title input.
2. When the Quick Switcher opens, focus moves to the search input.
3. When a modal (rename, delete confirm) opens, focus moves to the modal and is trapped.
4. On modal close, focus returns to the element that triggered the modal.
5. On page load, focus defaults to the first interactive element in the NotesList.

---

## 9. URL / Route Structure

Noto is a SPA without explicit URL routing in v1. Navigation state is maintained in React state and `localStorage`:

| State key | Stored value |
|---|---|
| `activeNotebookId` | Currently viewed notebook |
| `activeNoteId` | Currently open note |
| `viewMode` | `edit` / `preview` / `split` / `zen` |
| `sidebarOpen` | `true` / `false` |
| `theme` | `dark` / `light` / `eyecare` |

Future: implement URL hash routing for shareable note links.
