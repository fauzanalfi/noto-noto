# Grid System

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Layout Architecture

Noto uses a **fixed three-column slot layout** on desktop, not a fluid 12-column grid in the traditional sense. However, the **12-column grid** governs the *content* within each panel — particularly the editor canvas and any modal/overlay surfaces.

```
┌────────────────┬──────────────────────┬──────────────────────────────┐
│  SIDEBAR       │  NOTES LIST          │  EDITOR / CANVAS             │
│  260px fixed   │  320px fixed         │  flex-1 (min: 400px)         │
│  cols 1–2      │  cols 3–5            │  cols 6–12                   │
└────────────────┴──────────────────────┴──────────────────────────────┘
```

---

## 2. Column Mapping

At 1280px viewport:
- **Column width:** ~82px
- **Gutter:** 24px (1.5 × `--space-lg`)
- **Sidebar:** spans 2 columns (164px + gutters = 260px)
- **Notes List:** spans 3 columns + gutters = 320px
- **Editor:** spans remaining 7 columns = flex

At 1440px viewport:
- **Column width:** ~93px
- Editor grows with available space; sidebar and notes list remain fixed.

---

## 3. Breakpoints

| Name | Max-width | Layout change |
|---|---|---|
| **Desktop** | `> 1024px` | Three-column layout: Sidebar (260px) + NotesList (320px) + Editor (flex) |
| **Tablet** | `≤ 1024px` | NotesList narrows to 280px; sidebar remains 260px |
| **Mobile** | `≤ 768px` | Sidebar becomes off-canvas drawer; NotesList takes 100% width; Editor overlays full-screen |
| **Mobile S** | `≤ 480px` | Further padding reduction on editor canvas; FAB repositions |

---

## 4. Layout Tokens

```css
--sidebar-width:     260px;    /* Desktop sidebar */
--noteslist-width:   320px;    /* Desktop notes list */
--toolbar-height:    48px;     /* Top editor toolbar */
--header-height:     56px;     /* Notes list header / mobile header */
```

### Tablet Override
```css
@media (max-width: 1024px) {
  --noteslist-width: 280px;
}
```

### Mobile Override
```css
@media (max-width: 768px) {
  --sidebar-width: 280px;  /* Drawer is slightly wider on mobile for touch */
  --noteslist-width: 100%;
}
```

---

## 5. Special Layout Modes

### Kanban Mode
The notes list expands to fill 70% of the workspace; the editor takes 30%.

```
┌────────────────┬───────────────────────────────────┬────────────────┐
│  SIDEBAR       │  KANBAN BOARD (70%)                │  EDITOR (30%) │
└────────────────┴───────────────────────────────────┴────────────────┘
```

### Zen Mode
Sidebar and notes list are hidden (`display: none`). Editor canvas is full-width with a content column constraint:

```css
.zen-mode .editor-canvas-inner {
  max-width: 680px;    /* Optimal line length: ~75 characters at 15px */
  margin: 0 auto;
}
```

> 680px at 15px Inter produces ~72–80 characters per line — the typographic sweet spot (WCAG 1.4.8: 80 characters maximum).

### Split View (Editor)
- **Horizontal split:** Editor left / Preview right (flex-direction: row).
- **Vertical split:** Editor top / Preview bottom (flex-direction: column).

---

## 6. Editor Content Width

In normal (non-Zen) mode, the editor canvas has no max-width constraint. Users who want full-width editing can use the available space. On ultra-wide displays (> 1920px), designers may consider a soft constraint of 900px for the editor content column — flagged as a future enhancement.

---

## 7. Modal / Overlay Grid

Modals and panels that float over the UI use fixed widths chosen from these standard sizes:

| Modal size | Width | Usage |
|---|---|---|
| Compact | `360px` | Confirmation dialogs, simple inputs |
| Standard | `480px` | Settings, form modals |
| Wide | `560px` | Quick switcher |
| Full | `calc(100vw - 64px)` max `720px` | Complex content editors |

All modals are horizontally centered (`left: 50%; transform: translateX(-50%)`). On mobile (≤ 768px), modals expand to `calc(100vw - 32px)`.

---

## 8. Gutter & Padding Conventions

| Context | Horizontal padding | Vertical padding |
|---|---|---|
| Sidebar content | `--space-xl` (24px) | `--space-md` (12px) |
| Notes list content | `--space-lg` (16px) | `--space-md` (12px) |
| Editor canvas | `--space-xl` (24px) | `--space-xl` (24px) |
| Toolbar | `--space-lg` (16px) | `--space-sm` (8px) |
| Modal body | `--space-2xl` (32px) | `--space-2xl` (32px) |

---

## 9. Safe Area Support

On iOS/iPadOS, layout-affecting edges respect `env(safe-area-inset-*)`:

```css
/* Mobile header */
padding-top: max(var(--space-md), env(safe-area-inset-top));

/* Sidebar drawer */
padding-bottom: max(var(--space-xl), env(safe-area-inset-bottom));

/* FAB button */
bottom: calc(var(--space-lg) + env(safe-area-inset-bottom, 0px));
```
