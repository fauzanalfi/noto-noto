# Select (Dropdown Select)

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

The Select component provides a single-choice dropdown for settings and filters. In Noto it is used for Sort by, Theme selection, and PARA category pickers.

---

## 2. Anatomy

```
┌── .select-wrapper ──────────────────────────────────────┐
│  [Selected value]                   [ChevronDown icon]  │
└─────────────────────────────────────────────────────────┘
```

| Part | Token |
|---|---|
| Wrapper | `--bg-secondary` bg, `--border-primary` border, `--radius-md` |
| Value text | `--font-size-sm`, `--text-primary` |
| Chevron | `14px`, `--text-muted` |

---

## 3. States

| State | Border | BG |
|---|---|---|
| Default | `--border-primary` | `--bg-secondary` |
| Hover | `--border-accent` | `--bg-secondary` |
| Focus-visible | `--accent-primary` 2px | `--bg-secondary` |
| Open | `--border-accent` | `--bg-secondary` |
| Disabled | `--border-primary` opacity 0.5 | `--bg-primary` |

---

## 4. Native vs Custom

Use the **native** `<select>` element styled with `appearance: none` for baseline accessibility. Apply a custom chevron via background-image or a positioned icon.

---

## 5. Accessibility

- `<label>` associated via `for`/`id`.
- Keyboard: `Space` opens, `↑`/`↓` navigate, `Enter` selects, `Esc` closes.
- `aria-invalid` + helper text on validation failure.

---

## 6. CSS Spec

```css
.select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.select {
  appearance: none;
  padding: var(--space-sm) 32px var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  width: 100%;
  transition: border-color var(--transition-fast);
  font-family: var(--font-sans);
}

.select:hover { border-color: var(--border-accent); }

.select:focus-visible {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(from var(--accent-primary) r g b / 0.2);
}

.select-chevron {
  position: absolute;
  right: var(--space-sm);
  pointer-events: none;
  color: var(--text-muted);
}

.select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```
