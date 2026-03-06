# Tooltip

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Tooltips reveal a short label on pointer hover or keyboard focus for icon-only controls. They are non-interactive and disappear on pointer-out or blur.

---

## 2. Anatomy

```
    ▲ (arrow)
┌── .tooltip ──┐
│  Label text  │
└──────────────┘
```

| Part | Token |
|---|---|
| Container | `--bg-inverse` (dark-on-light / light-on-dark), `--text-inverse`, `--radius-sm` |
| Arrow | CSS `::before` triangle, matches bg |
| Text | `--font-size-xs`, weight 500 |

---

## 3. Placement

Prefer **top** placement. Auto-flip to bottom/left/right when near viewport edge.

| Placement | Arrow position |
|---|---|
| top | Arrow points down, centered on trigger |
| bottom | Arrow points up |
| left | Arrow points right |
| right | Arrow points left |

---

## 4. Accessibility

- `role="tooltip"`, `id` referenced by trigger's `aria-describedby`.
- Never put interactive content (buttons, links) inside a tooltip.
- Maximum delay before show: `600ms`; immediate hide on pointer-out.

---

## 5. CSS Spec

```css
.tooltip {
  position: absolute;
  background: var(--bg-inverse);
  color: var(--text-inverse);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: var(--z-tooltip);
  opacity: 0;
  animation: var(--anim-fade-in) forwards;
  animation-delay: 600ms;
}

[data-theme="light"] .tooltip {
  background: var(--text-primary);
  color: var(--bg-primary);
}
```
