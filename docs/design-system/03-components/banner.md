# Banner

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Banners communicate persistent, page-level messages that require user awareness (and optionally, action). Unlike toasts, banners do not auto-dismiss.

**When to use:** Login error, network offline, destructive action confirmation that failed, sync error.  
**When not to use:** Transient confirmations (use Toast). Field-level validation (use Input error state).

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  [A: Icon]  [B: Title]  [C: Description]       [D: Action] [×] │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Description |
|---|---|
| **A — Icon** | 18px Lucide icon. Color matches variant. |
| **B — Title** | Optional. `--font-size-sm`, weight 600. |
| **C — Description** | Main message. `--font-size-sm`, weight 400. |
| **D — Action** | Optional inline link/button for recovery action. |
| **× — Dismiss** | Optional. Present only if the banner is dismissable. |

---

## 3. Variants

| Variant | Left border | Icon | Role |
|---|---|---|---|
| **Info** | `--accent-secondary` | `Info` | `status` |
| **Success** | `--color-success` | `CheckCircle` | `status` |
| **Warning** | `--color-warning` | `AlertTriangle` | `status` |
| **Danger** | `--color-danger` | `AlertCircle` | `alert` |

---

## 4. Accessibility

- `role="alert"` for danger (assertive). `role="status"` for others (polite).
- Dismiss button: `aria-label="Dismiss"`.
- If banner contains an action link, ensure it has a descriptive label (not just "Click here").

---

## 5. CSS Spec

```css
.banner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  line-height: 1.5;
}

.banner.info    { border-left: 3px solid var(--accent-secondary); }
.banner.success { border-left: 3px solid var(--color-success); }
.banner.warning { border-left: 3px solid var(--color-warning); }
.banner.danger  { border-left: 3px solid var(--color-danger); }

.banner-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.banner.info    .banner-icon { color: var(--accent-secondary); }
.banner.success .banner-icon { color: var(--color-success); }
.banner.warning .banner-icon { color: var(--color-warning); }
.banner.danger  .banner-icon { color: var(--color-danger); }

.banner-body { flex: 1; }
.banner-title {
  font-weight: 600;
  margin-bottom: 2px;
}
.banner-action {
  color: var(--accent-primary);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
  padding: 0;
  margin-top: var(--space-xs);
  display: inline;
}
```

---

## 6. Code Example

```jsx
{authError && (
  <div
    className="banner danger"
    role="alert"
    style={{ marginTop: 'var(--space-md)' }}
  >
    <AlertCircle size={18} className="banner-icon" aria-hidden="true" />
    <div className="banner-body">
      <p className="banner-title">Sign-in failed</p>
      <p>{authError}</p>
      <button className="banner-action" onClick={clearError}>
        Try again
      </button>
    </div>
  </div>
)}
```
