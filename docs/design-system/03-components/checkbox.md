# Checkbox

> **Version:** 1.0 — March 2026

---

## 1. Overview

A checkbox allows binary selection. In Noto, checkboxes appear in task lists rendered from Markdown `- [ ]` / `- [x]` syntax inside the TasksView.

---

## 2. Anatomy

```
 [A: Box]  [B: Label text]
```

| Part | Description |
|---|---|
| **A — Box** | 18px × 18px, `border-radius: var(--radius-full)`. Circle shape (vs. square) to differentiate from generic form checkboxes. On check: fills with `--accent-primary`, SVG checkmark strokes in. |
| **B — Label** | Task text. On check: `text-decoration: line-through`, color transitions to `--text-tertiary`. |

---

## 3. States

| State | Box appearance | Label |
|---|---|---|
| Unchecked | `border: 2px solid --border-default` | `--text-primary` |
| Unchecked hover | `border: 2px solid --accent-primary` | `--text-primary` |
| Checked | `background: --accent-primary; border-color: --accent-primary` + SVG checkmark | strike-through, `--text-tertiary` |
| Indeterminate | `background: --accent-primary` + dash glyph | — |
| Focus | `outline: 2px solid --accent-primary; outline-offset: 2px` | — |
| Disabled | `opacity: 0.45` | `--text-tertiary` |

---

## 4. Accessibility

- Native `<input type="checkbox">` is preferred over custom ARIA role.
- Each checkbox must have a label via `<label for>` or `aria-label`.
- For the task list, the label is the task text rendered adjacent.
- Indeterminate state requires `inputRef.current.indeterminate = true` (JS only; not settable via HTML).

---

## 5. Micro-interaction

On check: SVG `stroke-dasharray` animates from 0 to full length (150ms), then the label fades to `--text-tertiary` (200ms, delayed 100ms).

```css
.task-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border-default);
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.task-checkbox:hover {
  border-color: var(--accent-primary);
}

.task-checkbox.checked {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.task-done {
  text-decoration: line-through;
  color: var(--text-tertiary);
  transition: color var(--transition-normal);
}
```

---

## 6. Code Example

```jsx
<li className={`task-item ${item.checked ? 'task-done' : ''}`}>
  <button
    className={`task-checkbox ${item.checked ? 'checked' : ''}`}
    role="checkbox"
    aria-checked={item.checked}
    aria-label={item.text}
    onClick={() => onToggle(item.id)}
  >
    {item.checked && <Check size={11} strokeWidth={3} aria-hidden="true" />}
  </button>
  <span className="task-text">{item.text}</span>
</li>
```
