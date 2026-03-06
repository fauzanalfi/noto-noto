# Context Menu

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A context menu appears anchored to a right-click or long-press event. It surfaces secondary, contextual actions for the target element. In Noto, context menus appear on note cards, notebook items, and the export action.

---

## 2. Anatomy

```
┌───────────────────────────────┐
│  [A: Icon]  [B: Label]        │  ← Item (default)
├───────────────────────────────┤
│  [A: Icon]  [B: Label]        │  ← Item (hover)
├───────────────────────────────┤  ← .context-menu-separator
│  [A: Icon]  [B: Label]    ▶  │  ← Item with submenu
├───────────────────────────────┤
│  [A: Icon]  [B: Label]        │  ← Item (danger style)
└───────────────────────────────┘
```

| Part | Description |
|---|---|
| **A — Icon** | 15px Lucide icon. `--text-tertiary` default; inherits item color on hover. |
| **B — Label** | `--font-size-sm`, `--text-primary`. Danger items use `--color-danger`. |
| **Separator** | `1px solid var(--border-subtle)`, `margin: 4px 0`. |

---

## 3. States

| State | Background | Text color |
|---|---|---|
| Default | transparent | `--text-primary` |
| Hover | `--bg-hover` | `--text-primary` |
| Danger hover | `--color-danger-subtle` | `--color-danger` |
| Disabled | transparent | `--text-tertiary`, no pointer events |

---

## 4. Positioning

1. Menu opens at the cursor/click position (`getBoundingClientRect()` + `pageX/Y`).
2. If the menu would overflow the right edge, flip to open left.
3. If the menu would overflow the bottom edge, flip to open upward.
4. A full-inset invisible click shield (`position: fixed; inset: 0; z-index: calc(var(--z-dropdown) - 1)`) dismisses the menu on outside click.

---

## 5. Accessibility

- **Role:** `role="menu"`. Each item: `role="menuitem"`.
- **Keyboard:** `↑` / `↓` navigate items; `Enter` / `Space` activates; `Escape` closes; `Tab` closes.
- **Focus:** First item gets focus when menu opens.
- **Trigger:** The element that opens the menu should have `aria-haspopup="true"` and `aria-expanded`.
- Separator elements use `role="separator"`.

---

## 6. CSS Spec

```css
.context-menu {
  position: fixed;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  min-width: 180px;
  padding: var(--space-xs) 0;
  animation: var(--anim-modal-in);
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background var(--transition-fast);
}

.context-menu-item:hover {
  background: var(--bg-hover);
}

.context-menu-item.danger {
  color: var(--color-danger);
}
.context-menu-item.danger:hover {
  background: var(--color-danger-subtle);
}

.context-menu-item .icon {
  width: 15px;
  height: 15px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
.context-menu-item:hover .icon,
.context-menu-item.danger .icon {
  color: currentColor;
}

.context-menu-separator {
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-xs) 0;
}
```

---

## 7. Code Example

```jsx
function NoteContextMenu({ position, note, onClose, onDelete, onMove, onDuplicate }) {
  return (
    <>
      {/* Click shield */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-dropdown) - 1)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <ul
        role="menu"
        className="context-menu"
        style={{ top: position.y, left: position.x }}
        aria-label="Note options"
      >
        <li role="menuitem">
          <button className="context-menu-item" onClick={onDuplicate}>
            <Copy size={15} className="icon" aria-hidden="true" />
            Duplicate
          </button>
        </li>
        <li role="menuitem">
          <button className="context-menu-item" onClick={onMove}>
            <FolderOpen size={15} className="icon" aria-hidden="true" />
            Move to notebook
          </button>
        </li>
        <div className="context-menu-separator" role="separator" />
        <li role="menuitem">
          <button className="context-menu-item danger" onClick={onDelete}>
            <Trash2 size={15} className="icon" aria-hidden="true" />
            Delete
          </button>
        </li>
      </ul>
    </>
  )
}
```
