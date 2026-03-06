# Input

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Text input for single-line data entry. In Noto, inputs appear in search, tag entry, notebook renaming, and modal forms.

---

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│  [A: Icon]  [B: Input field]  [C: Clear]    │
└─────────────────────────────────────────────┘
         [D: Container]
[E: Label] — above container
[F: Error message] — below container
```

| Part | Description |
|---|---|
| **A — Leading icon** | Optional. 16px Lucide icon, `--text-tertiary`. |
| **B — Input field** | The `<input>` element. |
| **C — Clear action** | Optional. Appears when value is non-empty. `×` glyph, 14px. |
| **D — Container** | Background + border; indicates focus state. |
| **E — Label** | Required for form contexts. Hidden visually only if `aria-label` is provided. |
| **F — Error message** | Displayed below container when `aria-invalid="true"`. `--color-danger`, `--font-size-xs`. |

---

## 3. States

| State | Border | Background | Text |
|---|---|---|---|
| Default | `var(--border-default)` | `var(--bg-input)` | `var(--text-primary)` |
| Hover | `var(--border-hover)` | same | same |
| Focus | `var(--accent-primary)` + `box-shadow: 0 0 0 3px rgba(accent, .1)` | same | same |
| Filled | same as Default | same | `var(--text-primary)` |
| Disabled | `var(--border-subtle)` | `var(--bg-tertiary)` | `var(--text-tertiary)` |
| Error | `var(--color-danger)` | same | same |

---

## 4. Accessibility

- Always associate a `<label>` via `for`/`id` or `aria-label` for screen readers.
- On error, set `aria-invalid="true"` and `aria-describedby` pointing to the error message element.
- Placeholder text is **not a label substitute** — placeholders disappear and have low contrast.
- Min touch target height: 44px on mobile (use min-height on the container, not the `input` itself).

---

## 5. CSS Spec

```css
.form-input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  gap: var(--space-sm);
  min-height: 36px;  /* 44px on mobile via media query */
}

.form-input-wrap:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(from var(--accent-primary) r g b / 0.1);
}

.form-input-wrap.error {
  border-color: var(--color-danger);
}

.form-input {
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  width: 100%;
}

.form-input::placeholder { color: var(--text-tertiary); }

.form-input-error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin-top: var(--space-xs);
}
```

---

## 6. Code Example

```jsx
<div>
  <label htmlFor="notebook-name" className="form-label">
    Notebook name
  </label>
  <div className={`form-input-wrap ${error ? 'error' : ''}`}>
    <BookOpen size={16} className="form-input-icon" aria-hidden="true" />
    <input
      id="notebook-name"
      type="text"
      className="form-input"
      placeholder="e.g. Weekly Reviews"
      value={value}
      onChange={e => setValue(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? 'notebook-name-error' : undefined}
    />
  </div>
  {error && (
    <p id="notebook-name-error" className="form-input-error" role="alert">
      {error}
    </p>
  )}
</div>
```
