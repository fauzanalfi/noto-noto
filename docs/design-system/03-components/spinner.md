# Spinner

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A Spinner communicates that an indeterminate-length async operation is in progress. In Noto, spinners appear during initial data loading, note syncing, and export operations.

---

## 2. Anatomy

```
    ◡
  ◜   ◝   ← [A: Track (full circle, dimmed)]
  ◟   ◞   ← [B: Indicator arc (partial, animated)]
    ◠
```

| Part | Description |
|---|---|
| **A — Track** | Full-circle SVG stroke, `--border-default` color. |
| **B — Indicator arc** | Partial arc (25%), `--accent-primary` color. Rotates 360° continuously. |

---

## 3. Sizes

| Size | Diameter | Stroke width | CSS class |
|---|---|---|---|
| Small | 16px | 2px | `.spinner-sm` |
| Default | 20px | 2px | `.spinner` |
| Large | 32px | 3px | `.spinner-lg` |

---

## 4. Accessibility

- Always include `role="status"` and `aria-label="Loading"` (or a context-specific message).
- If the loading state has a visible text label, use `aria-labelledby` instead.
- With `prefers-reduced-motion: reduce`, switch from a rotating animation to a pulsing opacity animation.

---

## 5. CSS Spec

```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
  flex-shrink: 0;
}

.spinner-sm { width: 16px; height: 16px; border-width: 2px; }
.spinner-lg { width: 32px; height: 32px; border-width: 3px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    opacity: 0.5;
    border-top-color: var(--border-default);
    /* Static appearance for users who prefer no motion */
  }
}
```

---

## 6. Code Example

```jsx
{/* Loading notes list */}
<div className="notes-list-loading" aria-label="Loading notes">
  <span className="spinner" role="status" aria-label="Loading" />
  <span className="visually-hidden">Loading notes…</span>
</div>

{/* Inline with button */}
<button className="btn btn-primary" disabled aria-busy="true">
  <span className="spinner spinner-sm" aria-hidden="true" />
  Saving…
</button>
```
