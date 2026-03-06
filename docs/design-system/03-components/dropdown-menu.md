# Dropdown Menu

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A Dropdown Menu is a triggered list of labelled actions, optionally grouped with dividers. It is semantically distinct from a Context Menu (which appears at a pointer position) — a Dropdown is anchored to a specific trigger button. In Noto, the Export menu, Sort menu, and notebook ⋯ overflow use this component.

---

## 2. Anatomy

```
┌── .dropdown-menu ──────────────────────────────┐
│  [Group label]                                  │
│  [A: Item icon] [B: Label]     [C: Shortcut]   │
│  [A: Item icon] [B: Label]                      │
│  ─── [Divider] ─────────────────────────────    │
│  [A: Item icon] [B: Label — danger]             │
└─────────────────────────────────────────────────┘
```

| Part | Token |
|---|---|
| Menu container | `--bg-secondary`, `--border-primary`, `--shadow-xl`, `--radius-md` |
| Item | `--font-size-sm`, `--text-primary`, hover: `--bg-hover` |
| Icon | `14px` Lucide, `--text-secondary` |
| Shortcut | `--font-size-xs`, `--text-muted` |
| Danger item | `--color-danger` text + hover bg |
| Group label | `--font-size-xs`, `--text-muted`, uppercase |
| Divider | `1px var(--border-primary)` |

---

## 3. Variants

| Variant | Description |
|---|---|
| **Action menu** | Mixed icons + labels, 1–2 levels |
| **Sort / filter** | Radio-style checked items |
| **Export format** | Items with sub-label (format description) |

---

## 4. States

| Item state | Style |
|---|---|
| Default | `transparent` bg |
| Hover | `--bg-hover` bg |
| Active / selected | Checkmark icon left + `--text-accent` |
| Disabled | `opacity: 0.4`, `pointer-events: none` |
| Danger | `--color-danger` text, `--color-danger-subtle` hover bg |

---

## 5. Accessibility

- `role="menu"` on container, `role="menuitem"` on each action.
- For checked variants: `role="menuitemradio"` with `aria-checked`.
- `aria-orientation="vertical"`.
- `↑`/`↓` navigate items; `Enter`/`Space` activate; `Esc` closes.
- Focus trap: focus stays inside menu until dismissed.
- Trigger has `aria-haspopup="menu"` and `aria-expanded`.

---

## 6. CSS Spec

```css
.dropdown-menu {
  position: absolute;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  padding: var(--space-xs) 0;
  z-index: var(--z-dropdown);
  min-width: 180px;
  animation: var(--anim-fade-in);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-fast);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--bg-hover);
}

.dropdown-item.selected {
  color: var(--text-accent);
}

.dropdown-item.danger {
  color: var(--color-danger);
}

.dropdown-item.danger:hover {
  background: var(--color-danger-subtle);
}

.dropdown-shortcut {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-primary);
  margin: var(--space-xs) 0;
}

.dropdown-group-label {
  padding: var(--space-xs) var(--space-md) 2px;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  user-select: none;
}
```
