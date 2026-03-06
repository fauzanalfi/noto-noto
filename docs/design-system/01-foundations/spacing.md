# Spacing

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Base Grid Unit

All spacing values are multiples of **4px** (the base grid unit), anchored on an **8px baseline grid**. Every margin, padding, and gap in Noto must be a value from this scale. No arbitrary pixel values in component styles.

```
Base unit: 4px
Grid unit: 8px
```

---

## 2. Spacing Scale

| Token | Value | Grid units | Usage |
|---|---|---|---|
| `--space-xs` | `4px` | ½ grid | Icon-to-label gap, intra-badge padding, minimal insets |
| `--space-sm` | `8px` | 1 grid | Intra-component gaps, tag padding, tight button padding |
| `--space-md` | `12px` | 1.5 grid | Comfortable padding inside compact components (sidebar items, toolbar buttons) |
| `--space-lg` | `16px` | 2 grid | Section content padding, card insets, standard button padding |
| `--space-xl` | `24px` | 3 grid | Panel-level padding, large card content, editor canvas insets |
| `--space-2xl` | `32px` | 4 grid | Between sections on a page, modal body padding |
| `--space-3xl` | `48px` | 6 grid | Large vertical separations, top/bottom padding on empty states |
| `--space-4xl` | `64px` | 8 grid | Page-level sectioning, hero areas, marketing sections |

> **Note on `12px`:** The `--space-md: 12px` value breaks the pure powers-of-two 8px grid. It is intentional — Noto's compact information density requires a "medium-tight" padding level between 8 and 16. Use it inside components; prefer 16px for between-component spacing.

---

## 3. Usage by Context

### Intra-component (within a single component)
Use `--space-xs` (4px) and `--space-sm` (8px).

```
Sidebar item icon ↔ label:  --space-md (12px)
Toolbar button intrinsic padding: 4px × 8px
Tag padding: 2px × 8px
```

### Intra-section (between sibling components within a panel)
Use `--space-sm` (8px) to `--space-lg` (16px).

```
Between note cards in list: 2px margin (special — density-optimized)
Between sidebar sections: --space-md (12px)
Search box margin: 0 --space-lg (16px)
```

### Inter-panel (between major layout regions)
Use `--space-xl` (24px) to `--space-3xl` (48px).

```
Editor canvas top padding: --space-xl (24px)
Empty state vertical padding: --space-3xl (48px)
Login card padding: --space-2xl (32px)
```

---

## 4. Special Values

These are component-specific spacings that don't map directly to the scale:

| Component | Property | Value | Notes |
|---|---|---|---|
| Note card gutter | `margin-top / bottom` | `2px` | Ultra-dense list; acceptable at this scale |
| Tag inline padding | `padding` | `2px 8px` | `2px = ½ × --space-xs` |
| Note card tags | `padding` | `1px 6px` | Micro tag inside note card |
| Sidebar item count | `padding` | `1px 7px` | Badge pill |
| Scrollbar width | `width` | `5px` | Outside scale; platform convention |

---

## 5. Responsive Adjustments

On `max-width: 768px`, horizontal panel insets reduce to prevent wasted space on small screens:

```css
/* Desktop */
padding: var(--space-xl) var(--space-xl);   /* 24px */

/* Mobile override */
@media (max-width: 768px) {
  padding: var(--space-md) var(--space-lg);  /* 12px 16px */
}
```

---

## 6. Do's & Don'ts

### ✅ DO
- Use `--space-lg` (16px) as the default content inset for panels.
- Use `--space-xs` (4px) for icon-to-icon gaps in toolbars.
- Use `--space-3xl` (48px) for the vertical breathing room in empty states.

### ❌ DON'T
- Don't combine arbitrary `px` values in spacing (`padding: 11px 17px` — replace with `--space-md --space-lg`).
- Don't use `--space-4xl` (64px) inside components — it's for page-level layout only.
- Don't add margins to the left/right of the three-column layout panels — use padding inside.
