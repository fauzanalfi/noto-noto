# Radio

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Radio buttons present a set of mutually exclusive options. In Noto they appear in Settings panels and sort/filter sheets.

---

## 2. Anatomy

```
( ● ) [Label]
(   ) [Label]
```

| Part | Token |
|---|---|
| Outer ring | `14px`, `var(--border-primary)` 1.5px stroke |
| Inner dot | `6px`, `var(--accent-primary)` fill — visible when checked |
| Label | `--font-size-sm`, `--text-primary` |

---

## 3. States

| State | Outer ring | Inner dot |
|---|---|---|
| Unchecked | `--border-primary` | hidden |
| Checked | `--accent-primary` | `--accent-primary` (6px) |
| Hover (unchecked) | `--border-accent` | hidden |
| Hover (checked) | `--accent-hover` | `--accent-hover` |
| Focus-visible | `--accent-primary` + 2px focus ring | — |
| Disabled | `--text-muted`, opacity 0.5 | — |

---

## 4. Accessibility

- Use `<input type="radio">` — visually hidden with CSS, custom overlay.
- Group wrapped in `<fieldset>` with `<legend>` describing the group.
- `aria-checked` reflects state.

---

## 5. CSS Spec

```css
.radio-group { display: flex; flex-direction: column; gap: var(--space-sm); }

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  user-select: none;
}

.radio-input {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--border-primary);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  position: relative;
  cursor: pointer;
}

.radio-input:hover { border-color: var(--border-accent); }

.radio-input:checked {
  border-color: var(--accent-primary);
  background: radial-gradient(circle, var(--accent-primary) 40%, transparent 40%);
}

.radio-input:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```
