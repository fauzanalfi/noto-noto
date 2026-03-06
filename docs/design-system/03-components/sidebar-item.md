# Sidebar Item

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/Sidebar.jsx`, CSS class `.sidebar-item`

---

## 1. Overview

The Sidebar Item is the primary navigational unit inside the collapsible Sidebar. It represents a Notebook (with a PARA-color dot), a PARA category (with a Lucide icon), or a utility action (Settings, Trash).

---

## 2. Anatomy

```
┌─── .sidebar-item ────────────────────────────────────────────────────────┐
│  [A: Active bar]  [B: PARA dot / Icon]  [C: Label]  [D: Count badge]     │
└──────────────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Active bar** | `3px` wide, `var(--accent-primary)` bg | Positioned `left: 0`, full height, `border-radius: 0 var(--radius-sm) var(--radius-sm) 0` |
| **B — PARA dot** | 8px circle, `var(--para-*)` bg | Shown for Notebooks; replaced by Lucide icon for categories |
| **C — Label** | `--font-size-sm`, `--text-secondary` → `--text-primary` on active | `white-space: nowrap`, truncated with ellipsis |
| **D — Count** | `--font-size-xs`, `--text-tertiary` | Note count; omitted when 0 |

---

## 3. Variants

| Variant | Description |
|---|---|
| **PARA Category** | Fixed (Projects, Areas, Resources, Archive, Inbox), Lucide icon + label only, no count |
| **Notebook** | User-created notebook, PARA-color dot + label + note count |
| **Section header** | `--text-tertiary`, uppercase, `--font-size-xs`, not interactive |
| **Utility action** | Settings, Trash — tertiary icon, bottom of sidebar |

---

## 4. States

| State | Background | Label color | Border-left |
|---|---|---|---|
| Default | `transparent` | `--text-secondary` | hidden |
| Hover | `--bg-hover` | `--text-primary` | hidden |
| Active | `--bg-tertiary` | `--text-primary` | `3px var(--accent-primary)` |
| Disabled | `transparent` | `--text-muted` | hidden |
| Loading | skeleton shimmer over label | — | — |

---

## 5. PARA Color Mapping

| PARA category | CSS variable | Default value (dark) |
|---|---|---|
| Projects | `--para-projects` | `#c084fc` |
| Areas | `--para-areas` | `#60a5fa` |
| Resources | `--para-resources` | `#34d399` |
| Archive | `--para-archive` | `#94a3b8` |
| Inbox | `--para-inbox` | `#f59e0b` |

---

## 6. Interaction

| Trigger | Action |
|---|---|
| Click | Set active notebook / category |
| Right-click (Notebook) | Context menu: Rename, Move, Delete |
| Long-press (mobile) | Same context menu as right-click |
| Drag from Note Card | Drop-zone highlight on sidebar item |

Drop zone highlight: `background: rgba(from var(--accent-primary) r g b / 0.08); border: 1px dashed var(--border-accent)`.

---

## 7. Accessibility

- Each sidebar item is a `<button>` with `aria-current="page"` when active.
- The PARA dot has `role="presentation"` and `aria-hidden="true"`.
- Note count is wrapped in `<span aria-label="N notes">` (screen-reader label).
- The sidebar nav container uses `role="navigation"` with `aria-label="Notebooks"`.

---

## 8. CSS Spec

```css
.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 6px var(--space-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  position: relative;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-item.active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 3px;
  background: var(--accent-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar-para-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.sidebar-item-count {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  flex-shrink: 0;
}
```

---

## 9. Code Example

```jsx
<button
  className={`sidebar-item ${isActive ? 'active' : ''}`}
  onClick={() => onSelectNotebook(notebook.id)}
  aria-current={isActive ? 'page' : undefined}
>
  <span
    className="sidebar-para-dot"
    style={{ background: `var(--para-${notebook.paraCategory})` }}
    role="presentation"
    aria-hidden="true"
  />
  <span className="sidebar-item-label">{notebook.name}</span>
  {notebook.noteCount > 0 && (
    <span
      className="sidebar-item-count"
      aria-label={`${notebook.noteCount} notes`}
    >
      {notebook.noteCount}
    </span>
  )}
</button>
```
