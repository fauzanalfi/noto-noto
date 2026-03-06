# Toast / Snackbar

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Toasts provide brief, non-blocking feedback for actions that just occurred. They auto-dismiss after a fixed duration. They never require user action to proceed.

**When to use:** Autosave confirmation, note created/deleted, tag added, copy success.  
**When not to use:** Errors that require user action (use a Banner instead). Multi-step feedback. Critical status changes.

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────────┐
│  [A: Icon]  [B: Message]                 [C: Dismiss ×] │
└─────────────────────────────────────────────────────────┘
```

| Part | Description |
|---|---|
| **A — Icon** | 16px Lucide icon. Color matches variant (`--color-success`, `--color-danger`, etc.). Optional. |
| **B — Message** | Brief single-sentence description. `--font-size-sm`, `--text-primary`. |
| **C — Dismiss** | Optional `×` for user-dismissible toasts. Not shown on 3s auto-dismiss. |

---

## 3. Variants

| Variant | Icon | Background | Border-left | Usage |
|---|---|---|---|---|
| **Neutral** | — | `--bg-card` | none | General confirmations ("Note saved") |
| **Success** | `CheckCircle` | `--bg-card` | `3px solid --color-success` | Action completed |
| **Warning** | `AlertTriangle` | `--bg-card` | `3px solid --color-warning` | Soft caution |
| **Danger** | `AlertCircle` | `--bg-card` | `3px solid --color-danger` | Recoverable error |

---

## 4. States & Timing

| Phase | Duration | Animation |
|---|---|---|
| Enter | `200ms` | `slideUp` 8px + `fadeIn` (`--anim-modal-in`) |
| Hold | `3000ms` (default) | none |
| Exit | `200ms` | `fadeOut` |
| Stack | Multiple toasts stack vertically, 8px gap, newest at top |

---

## 5. Accessibility

- **Role:** `role="status"` for neutral/success toasts (polite announcement). `role="alert"` for danger (assertive, interrupts screen reader).
- **`aria-live`:** `polite` for non-critical; `assertive` for errors.
- The auto-dismiss timer must **pause** when the user hovers over the toast.
- Dismiss button must have `aria-label="Dismiss notification"`.
- Min touch target for dismiss button: 44×44px.

---

## 6. CSS Spec

```css
.toast-container {
  position: fixed;
  bottom: calc(var(--space-xl) + env(safe-area-inset-bottom, 0px));
  right: var(--space-xl);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  min-width: 240px;
  max-width: 400px;
  pointer-events: all;
  animation: var(--anim-modal-in);
}

.toast.success { border-left: 3px solid var(--color-success); }
.toast.warning { border-left: 3px solid var(--color-warning); }
.toast.danger  { border-left: 3px solid var(--color-danger); }

.toast-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
.toast.success .toast-icon { color: var(--color-success); }
.toast.warning .toast-icon { color: var(--color-warning); }
.toast.danger  .toast-icon { color: var(--color-danger); }
```

---

## 7. Code Example

```jsx
function Toast({ message, variant = 'neutral', onDismiss }) {
  const icons = {
    success: <CheckCircle size={16} className="toast-icon" aria-hidden="true" />,
    warning: <AlertTriangle size={16} className="toast-icon" aria-hidden="true" />,
    danger:  <AlertCircle size={16} className="toast-icon" aria-hidden="true" />,
  }

  return (
    <div
      className={`toast ${variant}`}
      role={variant === 'danger' ? 'alert' : 'status'}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
    >
      {icons[variant]}
      <span>{message}</span>
      {onDismiss && (
        <button
          className="btn btn-icon btn-sm"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{ marginLeft: 'auto' }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
```
