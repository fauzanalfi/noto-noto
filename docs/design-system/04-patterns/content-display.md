# Content Display Patterns

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Content display in Noto covers four distinct surfaces: the NotesList (summary view), the Markdown Preview, the Kanban Board (card view), and the Tasks View. Each surface presents note content at different levels of fidelity.

---

## 2. NotesList: Summary View

The NotesList displays note cards stacked vertically in a scrollable column.

**Density:** Comfortable (not compact). Each card shows title + 2-line snippet + date + up to 3 tags.

**Sort orders supported:**

| Sort | Default? | Direction |
|---|---|---|
| Last modified | ✅ Yes | Newest first |
| Created date | — | Newest first |
| Title (A–Z) | — | Ascending |
| Manual (drag) | — | User-defined |

Pinned notes always appear at the top of the list regardless of sort order.

**Empty state:** See [empty-state.md](../03-components/empty-state.md).

---

## 3. Markdown Preview

The Preview pane renders Markdown as HTML using a lightweight parser. Styling rules:

| Element | Token | Notes |
|---|---|---|
| `h1` | `var(--font-size-2xl)`, weight 700 | Article title level |
| `h2` | `var(--font-size-xl)`, weight 600 | Section |
| `h3` | `var(--font-size-lg)`, weight 600 | Sub-section |
| `h4` | `var(--font-size-md)`, weight 600 | Minor heading |
| `p` | `var(--font-size-base)`, `1.7` line-height | Body text |
| `code` (inline) | `var(--font-mono)`, `--bg-tertiary` bg | 4px padding, `--radius-sm` |
| `pre` | `var(--font-mono)`, `--bg-tertiary` bg | Scrollable, `--radius-md` |
| `blockquote` | `3px var(--accent-primary)` left border | Indented, `--text-secondary` |
| `a` | `--text-accent` | Underline on hover |
| `ul` / `ol` | `1.6` line-height | 1.5em left padding |
| `table` | `--border-primary` borders | Full width, alternating rows |
| `img` | `max-width: 100%`, `--radius-md` | Never overflow container |

The preview container has `max-width: 720px` and is horizontally centered within the Editor pane.

---

## 4. Split View

In Split mode, the Edit textarea and Preview pane share the editor width equally (each `50%`). A visual separator line divides them.

**Scroll sync:** The Preview pane scrolls proportionally to match the textarea scroll position — using a `scrollRatio` calculation on the textarea `scroll` event.

---

## 5. Kanban Board

The KanbanBoard groups notes by a `status` field (`todo` / `in-progress` / `done`). Display rules:

- Maximum 3 columns (predefined status values).
- Cards show title + 2-line snippet + 2 tags + date.
- Column headers show count badge.
- Cards are drag-and-drop reorderable within and across columns.

See [kanban-card.md](../03-components/kanban-card.md) for card-level spec.

---

## 6. Tasks View

The TasksView extracts checkbox items (`- [ ]` and `- [x]`) from note content and displays them as an interactive task list.

**Display rules:**
- Grouped by parent note (notebook name shown as group header).
- Completed tasks visually struck through with `--text-tertiary`.
- Clicking a task toggles the underlying Markdown (`- [ ]` ↔ `- [x]`), triggering an auto-save.
- Empty state when no tasks found in current notebook.

---

## 7. Loading States

Each panel shows a skeleton placeholder during initial data fetch:

| Panel | Skeleton |
|---|---|
| NotesList | 4× note card skeletons (title + 2 lines + date) |
| Editor | Blank textarea with a faint linear gradient shimmer |
| Kanban | 3 columns × 2 card skeletons each |

See [skeleton.md](../03-components/skeleton.md) for shimmer animation spec.

---

## 8. Error States

If a Firestore query fails, the affected panel shows an inline error banner (`.banner--error`) with a Retry button. The Error Boundary catches React render errors and shows the full-page `ErrorBoundary` UI.
