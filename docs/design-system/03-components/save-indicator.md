# Save Indicator

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/NoteToolbar.jsx`, CSS classes `.save-status`, `.save-status.*`

---

## 1. Overview

The Save Indicator is a small, unobtrusive status chip in the Note Toolbar. It reflects the live save state of the active note: `saving`, `saved`, or `error`. It is animated to draw attention only when the state changes.

---

## 2. Anatomy

```
┌── .save-status ───────────────┐
│  [A: Icon]  [B: Status label] │
└───────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Icon** | 12px Lucide icon | `Loader2` spin / `Check` / `AlertCircle` |
| **B — Label** | `--font-size-xs`, weight 500 | "Saving…" / "Saved" / "Error saving" |

---

## 3. States

| State | Class | Icon | Text | Color |
|---|---|---|---|---|
| Saving | `.save-status--saving` | `Loader2` (spin) | "Saving…" | `--text-tertiary` |
| Saved | `.save-status--saved` | `Check` | "Saved" | `--color-success` |
| Error | `.save-status--error` | `AlertCircle` | "Error saving" | `--color-danger` |
| Idle | (no indicator rendered) | — | — | — |

The `saved` state auto-fades after **2 seconds**. The `error` state persists until the user retries.

---

## 4. Transitions

| Transition | Value |
|---|---|
| Appear | `animation: var(--anim-fade-in)` |
| Fade on saved | `opacity: 0` after 2 s via CSS transition |
| Icon spin (saving) | `animation: spin 1s linear infinite` |

---

## 5. Reduced Motion

When `prefers-reduced-motion: reduce`, the spin animation is replaced with a static `Loader2` icon. The fade transitions are dropped to `0.01ms`.

---

## 6. Accessibility

- The container has `role="status"` and `aria-live="polite"` so screen readers announce state changes without interrupting the user.
- The icon has `aria-hidden="true"` — text label provides the accessible name.
- Do not use `aria-live="assertive"` — save status is not critical.

---

## 7. CSS Spec

```css
.save-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-tertiary);
  transition: opacity var(--transition-normal);
}

.save-status--saving {
  color: var(--text-tertiary);
}

.save-status--saved {
  color: var(--color-success);
}

.save-status--error {
  color: var(--color-danger);
}

.save-status--fading {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.save-status--saving .save-icon {
  animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .save-status--saving .save-icon {
    animation: none;
  }
}
```

---

## 8. Code Example

```jsx
import { Loader2, Check, AlertCircle } from 'lucide-react';

function SaveIndicator({ status }) {
  // status: 'saving' | 'saved' | 'error' | null
  const [visible, setVisible] = useState(!!status);

  useEffect(() => {
    if (status === 'saved') {
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
    setVisible(!!status);
  }, [status]);

  if (!visible || !status) return null;

  const config = {
    saving: { icon: <Loader2 size={12} className="save-icon" aria-hidden="true" />, text: 'Saving…' },
    saved:  { icon: <Check size={12} aria-hidden="true" />, text: 'Saved' },
    error:  { icon: <AlertCircle size={12} aria-hidden="true" />, text: 'Error saving' },
  };

  const { icon, text } = config[status];

  return (
    <span
      className={`save-status save-status--${status}`}
      role="status"
      aria-live="polite"
    >
      {icon}
      {text}
    </span>
  );
}
```
