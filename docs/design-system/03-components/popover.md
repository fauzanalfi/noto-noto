# Popover

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A Popover is a floating rich-content panel anchored to a trigger element. Unlike a Tooltip it can contain interactive elements (buttons, forms). In Noto it hosts the Export menu, Move to Notebook menu, and Tag Manager panel.

---

## 2. Anatomy

```
┌── .popover ──────────────────────────────────────────┐
│  [Optional header]                                    │
│  [Content area — arbitrary children]                  │
│  [Optional footer: Cancel / Confirm]                 │
└──────────────────────────────────────────────────────┘
```

| Part | Token |
|---|---|
| Container | `--bg-secondary`, `--border-primary`, `--shadow-xl`, `--radius-lg` |
| Header | `--font-size-sm`, weight 600, `--text-primary`, bottom border |
| Content | `padding: var(--space-md)` |
| Footer | top border, flex row end |

---

## 3. States

| State | Trigger |
|---|---|
| Hidden | `display: none` |
| Visible | Fade-in + translate: `translateY(-4px)` → `translateY(0)` |
| Closing | Fade-out, removed from DOM after transition |

---

## 4. Positioning

Anchored with `position: absolute` relative to trigger. Preferred placement: **bottom-start**. Auto-flip when near viewport edges.

Max-width: `320px`. Max-height: `60vh` with internal scroll.

---

## 5. Dismissal

- Click outside popover (click-outside listener on `document`).
- `Escape` key.
- Calling the `close()` function programmatically.

---

## 6. Accessibility

- `role="dialog"` for complex content; `role="listbox"` for option lists.
- `aria-modal="false"` — focus is NOT trapped (unlike Modal).
- Trigger has `aria-haspopup="dialog"` and `aria-expanded`.
- On open, focus moves to first interactive element inside.
- On close, focus returns to trigger.

---

## 7. CSS Spec

```css
.popover {
  position: absolute;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-popover);
  min-width: 200px;
  max-width: 320px;
  max-height: 60vh;
  overflow-y: auto;
  animation: var(--anim-fade-in);
}

.popover-header {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.popover-content {
  padding: var(--space-md);
}

.popover-footer {
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--border-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}
```
