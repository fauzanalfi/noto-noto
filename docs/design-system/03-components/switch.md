# Switch (Toggle)

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

The Switch is a binary toggle for persistent settings. In Noto it controls options like spell-check, auto-indent, Zen mode lock, and notification preferences.

---

## 2. Anatomy

```
[Track ─────── ] ●           ← Off
[ ───────── Track] ●         ← On
```

| Part | Size | Token |
|---|---|---|
| Track | `36×20px`, `--radius-full` | Off: `--bg-tertiary`; On: `--accent-primary` |
| Thumb | `16×16px` circle | `white`, `--shadow-sm`, translates `16px` on |

---

## 3. States

| State | Track | Thumb |
|---|---|---|
| Off | `--bg-tertiary` | `left: 2px` |
| On | `--accent-primary` | `left: 18px` |
| Hover (off) | `--bg-hover` | — |
| Hover (on) | `--accent-hover` | — |
| Focus-visible | 2px `--accent-primary` ring on track | — |
| Disabled | `opacity: 0.4` | — |

---

## 4. Animation

Thumb translation: `transform: translateX(0)` ↔ `translateX(16px)` over `var(--transition-fast)`.

---

## 5. Accessibility

- `<input type="checkbox" role="switch">` hidden, custom overlay.
- `aria-checked="true/false"`.
- `<label>` wraps input + track for click area.

---

## 6. CSS Spec

```css
.switch-track {
  display: inline-flex;
  align-items: center;
  width: 36px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  padding: 2px;
  cursor: pointer;
  transition: background var(--transition-fast);
  position: relative;
  flex-shrink: 0;
}

.switch-track[aria-checked="true"] {
  background: var(--accent-primary);
}

.switch-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  transform: translateX(0);
}

.switch-track[aria-checked="true"] .switch-thumb {
  transform: translateX(16px);
}

.switch-input:focus-visible + .switch-track {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```
