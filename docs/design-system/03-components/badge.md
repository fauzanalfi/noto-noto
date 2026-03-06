# Badge

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A Badge is a small inline label that communicates count, status, or category. Noto uses badges for note counts in the sidebar, Kanban column counts, and status indicators.

---

## 2. Anatomy

```
┌────────────┐
│  [A: Text] │
└────────────┘
  [B: Container — pill shape]
```

| Part | Description |
|---|---|
| **A — Text** | Number or short label (≤ 3 chars). `--font-size-xs`, weight 600. |
| **B — Container** | `border-radius: var(--radius-full)`. Background varies by variant. |

---

## 3. Variants

| Variant | CSS class | Background | Text | Usage |
|---|---|---|---|---|
| **Neutral** | `.badge` | `--bg-primary` | `--text-tertiary` | Note count in sidebar |
| **Accent** | `.badge.badge-accent` | `rgba(accent, .15)` | `--text-accent` | Active counts |
| **Success** | `.badge.badge-success` | `--color-success-subtle` | `--color-success` | Completion counts |
| **Danger** | `.badge.badge-danger` | `--color-danger-subtle` | `--color-danger` | Error/overdue counts |

---

## 4. Accessibility

- Badges displaying counts should be wrapped in a `<span>` with `aria-label` that gives context: `<span class="badge" aria-label="12 notes">12</span>`.
- If the badge is informational-only (adjacent to a labeled element), use `aria-hidden="true"` to avoid double-reading.

---

## 5. CSS Spec

```css
.badge {
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  color: var(--text-tertiary);
  min-width: 22px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
  white-space: nowrap;
}

.badge-accent {
  background: rgba(from var(--accent-primary) r g b / 0.15);
  color: var(--text-accent);
}

.badge-success {
  background: var(--color-success-subtle);
  color: var(--color-success);
}

.badge-danger {
  background: var(--color-danger-subtle);
  color: var(--color-danger);
}
```

---

## 6. Code Example

```jsx
<button className="sidebar-item active">
  <BookOpen size={18} className="icon" aria-hidden="true" />
  Resources
  <span className="badge" aria-label="14 notes">14</span>
</button>
```
