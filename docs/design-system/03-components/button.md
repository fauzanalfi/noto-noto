# Button

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

The Button is the primary means of triggering an action. It communicates affordance through visual weight, label clarity, and state feedback.

**When to use:** When a single, clearly-named action is available: saving, deleting, creating, submitting.  
**When not to use:** For navigation — use a link or sidebar item. For toggles — use Switch.

---

## 2. Anatomy

```
┌─────────────────────────────────────┐
│  [Icon] [A: Label]                  │
└─────────────────────────────────────┘
     [B: Container]
```

| Part | Description |
|---|---|
| **A — Label** | Required. Short imperative verb or verb phrase. Max 3 words. |
| **B — Container** | Bounding box. Background color, border radius, and shadow define variant. |
| **Icon** | Optional. Lucide icon, 16px, `aria-hidden="true"`. Left of label. |

---

## 3. Variants

| Variant | CSS class | Usage |
|---|---|---|
| **Primary** | `.btn .btn-primary` | Single primary CTA per screen/section |
| **Secondary** | `.btn .btn-secondary` | Supportive actions alongside primary |
| **Ghost** | `.btn .btn-ghost` | Tertiary actions in low-density areas |
| **Danger** | `.btn .btn-danger` | Destructive actions (delete, clear) |
| **Icon-only** | `.btn .btn-icon` | Toolbar buttons, compact icon actions |

### Sizes

| Size | Height | Padding | Font size | CSS modifier |
|---|---|---|---|---|
| Small | 28px | `4px 12px` | `--font-size-xs` | `.btn-sm` |
| Default | 36px | `8px 16px` | `--font-size-sm` | — |
| Large | 44px | `12px 24px` | `--font-size-base` | `.btn-lg` |

---

## 4. States

| State | Visual change |
|---|---|
| **Default** | Per-variant background + text |
| **Hover** | Background lightens/darkens per `--accent-primary-hover`. `translateY(-1px)` scale. |
| **Focus** | `outline: 2px solid var(--accent-primary); outline-offset: 2px` |
| **Active** | `scale(0.97)`, `translateY(0)`. Background darkens. |
| **Disabled** | `opacity: 0.45`, `cursor: not-allowed`, no hover effect |
| **Loading** | Label hidden, inline spinner shown. Pointer events disabled. |

---

## 5. Accessibility

- **Role:** `button` (native `<button>` element always preferred over ARIA role)
- **Label:** Visible text label is the `accessibleName`. Icon-only buttons must have `aria-label`.
- **Disabled:** Use `disabled` attribute, not just `aria-disabled`. This prevents focus on disabled buttons.
- **Loading:** Add `aria-busy="true"` when loading. Screen reader announces "loading" when role is polite.
- **Keyboard:** `Space` and `Enter` both activate buttons. Focus ring must be visible (already defined globally via `:focus-visible`).
- **Touch target:** Minimum 44 × 44px on mobile (HIG requirement). Use padding to achieve this on smaller visual buttons.

---

## 6. CSS Spec

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  padding: var(--space-sm) var(--space-lg);
  min-height: 36px;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--text-on-accent);
  border-color: transparent;
}
.btn-primary:hover { background: var(--accent-primary-hover); }

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-default);
}
.btn-secondary:hover { background: var(--bg-hover); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--color-danger-subtle);
  color: var(--color-danger);
  border-color: var(--color-danger-subtle);
}
.btn-danger:hover { background: var(--color-danger-subtle); filter: brightness(1.1); }

.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-lg { min-height: 44px; padding: var(--space-md) var(--space-xl); font-size: var(--font-size-base); }
.btn-sm { min-height: 28px; padding: var(--space-xs) var(--space-md); font-size: var(--font-size-xs); }
```

---

## 7. Code Example

```jsx
// Primary action
<button className="btn btn-primary" onClick={handleCreate}>
  <Plus size={16} aria-hidden="true" />
  New Note
</button>

// Danger action with confirmation intent
<button
  className="btn btn-danger"
  onClick={handleDelete}
  aria-label="Delete note permanently"
>
  <Trash2 size={16} aria-hidden="true" />
  Delete
</button>

// Loading state
<button className="btn btn-primary" disabled aria-busy="true">
  <Loader size={16} className="spin" aria-hidden="true" />
  Saving…
</button>

// Icon-only toolbar button (must have aria-label)
<button
  className="toolbar-btn"
  aria-label="Bold"
  title="Bold"
>
  <Bold size={16} aria-hidden="true" />
</button>
```
