# Divider

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Dividers create visual separation between groups of elements. Noto uses two categories: **structural dividers** (between major UI panels) and **toolbar dividers** (between logical groups of toolbar actions).

---

## 2. Variants

| Variant | CSS class | Orientation | Usage |
|---|---|---|---|
| **Horizontal** | `.divider` | Horizontal | Between sections in a panel, modal header/footer, dropdowns |
| **Vertical (toolbar)** | `.toolbar-divider` | Vertical, 24px height | Between logical groups in the editor toolbar |
| **Split panel** | `.split-divider.horizontal` / `.split-divider.vertical` | Either | Between editor and preview panes |

---

## 3. CSS Spec

```css
/* Structural horizontal divider */
.divider {
  height: 1px;
  background: var(--border-subtle);
  width: 100%;
  margin: var(--space-sm) 0;
  flex-shrink: 0;
}

/* Toolbar vertical divider */
.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--border-subtle);
  margin: 0 var(--space-sm);
  flex-shrink: 0;
}

/* Split view panel divider */
.split-divider {
  background: var(--border-subtle);
  flex-shrink: 0;
}
.split-divider.horizontal { width: 1px; height: 100%; }
.split-divider.vertical   { width: 100%; height: 1px; }
```

---

## 4. Accessibility

- Decorative dividers use `aria-hidden="true"` or are implemented as CSS borders rather than DOM elements.
- Menu separators inside context menus / dropdowns use `role="separator"`.
