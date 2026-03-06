# Kanban Card

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/KanbanBoard.jsx`, CSS classes `.kanban-card`, `.kanban-column`

---

## 1. Overview

The Kanban Card represents a note in a Kanban column. Cards are vertically stacked within columns (Todo, In Progress, Done) and support drag-and-drop reordering and cross-column movement.

---

## 2. Anatomy

```
┌─── .kanban-card ─────────────────────────────────────────────────┐
│  [A: Title]                                                       │
│  [B: Snippet / first line]                                        │
│  [C: Tag pills]        [D: Last-modified date]                    │
└───────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Title** | `--font-size-sm`, weight 600, `--text-primary` | 1-line clamp |
| **B — Snippet** | `--font-size-xs`, `--text-tertiary` | 2-line clamp |
| **C — Tags** | `.editor-tag` read-only variant | Max 2 shown |
| **D — Date** | `--font-size-xs`, `--text-muted` | Relative date |

---

## 3. States

| State | Styling |
|---|---|
| Default | `--bg-secondary` bg, `var(--border-primary)` border |
| Hover | `--bg-hover` bg, `var(--border-accent)` border |
| Active (selected) | `--bg-tertiary`, `var(--border-accent)` 2px, `var(--shadow-md)` |
| Dragging | `opacity: 0.5`, `--bg-tertiary`, `var(--shadow-lg)`, cursor `grabbing` |
| Drag-over target (column) | Column gets `--bg-hover` background flash |
| Drop landing | Spring keyframe: `transform: scale(1.02)` → `scale(1)` over 200 ms |

---

## 4. Column Layout

```
┌─── .kanban-board ────────────────────────────────────────────────────────────┐
│  ┌── .kanban-column (Todo) ──┐  ┌── .kanban-column (In Progress) ──┐  ...   │
│  │  [Column header]          │  │  [Column header]                  │        │
│  │  [Card]                   │  │  [Card]                           │        │
│  │  [Card]                   │  └──────────────────────────────────┘        │
│  │  [+ Add card]             │                                               │
│  └───────────────────────────┘                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Board scroll: horizontal on desktop (overflow-x: auto), vertical within each column.
- Column min-width: `240px`, max-width: `320px`.
- Board uses `display: flex; gap: var(--space-lg); align-items: flex-start`.

---

## 5. Drag-and-Drop Spec

| Event | CSS / JS effect |
|---|---|
| `dragstart` | Add `.dragging` class, set `opacity: 0.5` |
| `dragenter` (column) | Add `.drag-over` to column →  `--bg-hover` bg |
| `dragleave` | Remove `.drag-over` |
| `drop` | Move card to column, animate with `spring` keyframe |
| `dragend` | Remove `.dragging` |

Touch support: HTML5 drag API + pointer-events polyfill.

---

## 6. Accessibility

- Each card is a `<div>` with `role="button"` and `tabIndex={0}` for keyboard activation.
- `aria-grabbed` reflects drag state.
- Each column has `role="group"` and `aria-label="[Column name] column"`.
- Board keyboard: `Arrow keys` move a focused card between columns when holding `Shift`.

---

## 7. CSS Spec

```css
.kanban-board {
  display: flex;
  gap: var(--space-lg);
  overflow-x: auto;
  padding: var(--space-lg);
  align-items: flex-start;
  height: 100%;
}

.kanban-column {
  min-width: 240px;
  max-width: 320px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: background var(--transition-fast);
}

.kanban-column.drag-over {
  background: var(--bg-hover);
  border-color: var(--border-accent);
}

.kanban-column-header {
  padding: var(--space-md) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.kanban-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  overflow-y: auto;
  flex: 1;
}

.kanban-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: grab;
  transition: all var(--transition-fast);
  user-select: none;
}

.kanban-card:hover {
  border-color: var(--border-accent);
  background: var(--bg-hover);
}

.kanban-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
  box-shadow: var(--shadow-lg);
}

@keyframes card-drop-spring {
  0%   { transform: scale(1.02); }
  60%  { transform: scale(0.99); }
  100% { transform: scale(1); }
}

.kanban-card.dropped {
  animation: card-drop-spring 200ms var(--ease-spring) forwards;
}
```
