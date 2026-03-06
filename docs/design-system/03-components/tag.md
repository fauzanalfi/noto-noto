# Tag (Generic Label)

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Note:** For the Noto-specific editable tag pill used in the editor, see [tag-pill.md](./tag-pill.md).

---

## 1. Overview

The generic Tag is a compact, read-only semantic label for categorising content in lists, cards, and tables. It communicates status, type, or metadata at a glance.

---

## 2. Anatomy

```
┌── .tag ──────────────────┐
│  [Optional dot] [Label]  │
└──────────────────────────┘
```

| Part | Token |
|---|---|
| Container | `--radius-full`, `padding: 2px 8px` |
| Label | `--font-size-xs`, weight 500 |
| Colour dot | `6px` circle (optional) |

---

## 3. Variants

| Variant | BG | Text |
|---|---|---|
| `default` | `rgba(accent, .12)` | `--text-accent` |
| `success` | `var(--color-success-subtle)` | `var(--color-success)` |
| `warning` | `var(--color-warning-subtle)` | `var(--color-warning)` |
| `danger` | `var(--color-danger-subtle)` | `var(--color-danger)` |
| `info` | `var(--color-info-subtle)` | `var(--color-info)` |
| `neutral` | `var(--bg-tertiary)` | `--text-secondary` |

---

## 4. Sizes

| Size | Font | Padding |
|---|---|---|
| Default | `--font-size-xs` | `2px 8px` |
| Large | `--font-size-sm` | `4px 10px` |

---

## 5. CSS Spec

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}

.tag--default  { background: rgba(from var(--accent-primary) r g b / 0.12); color: var(--text-accent); }
.tag--success  { background: var(--color-success-subtle); color: var(--color-success); }
.tag--warning  { background: var(--color-warning-subtle); color: var(--color-warning); }
.tag--danger   { background: var(--color-danger-subtle);  color: var(--color-danger); }
.tag--info     { background: var(--color-info-subtle);    color: var(--color-info); }
.tag--neutral  { background: var(--bg-tertiary); color: var(--text-secondary); }

.tag--lg {
  font-size: var(--font-size-sm);
  padding: 4px 10px;
}
```
