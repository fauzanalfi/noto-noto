# Elevation & Depth

> **Role:** Apple Principal Designer  
> **Version:** 3.0 — March 2026

---

## 1. Depth Model

Noto 3.0 uses a **three-material layer model** with tonal layering as the default depth signal. Each layer has a distinct background, while shadows are reserved for overlays and critical floating affordances.

```
Layer 3 — Overlay     (Modals, Quick Switcher, Popovers)
Layer 2 — Surface     (Sidebar, Panels, Cards)
Layer 1 — Base        (App background, main canvas)
```

---

## 2. Shadow Scale

| Token | Value | Layer | Usage |
|---|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,.3)` | Surface | Cards on hover, inline button hover |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,.4)` | Surface → Overlay | Dropdowns, context menus, floating toolbar |
| `--shadow-lg` | `0 8px 30px rgba(0,0,0,.5)` | Overlay | Modals, Quick Switcher, Settings panel |
| `--shadow-xl` | `0 20px 60px rgba(0,0,0,.6)` | High Overlay | Dragged Kanban cards, notifications |
| `--accent-glow` | `0 0 20px rgba(124,106,239,.3)` | Accent surface | Brand logo, FAB button, primary CTA |

> Shadow alpha values differ per theme:
> - Dark: higher alpha (more contrast against dark bg)
> - Light: lower alpha (0.08–0.15)
> - Eye-care: warm-tinted alpha (`rgba(80,60,30,…)`)

---

## 3. Layer Specifications

### Layer 1 — Base
```css
background: var(--bg-primary);
box-shadow: none;
```
The three main columns (sidebar, notes list, editor) all sit at this level. Distinguished from each other purely by **background color** (`--bg-secondary`, `--bg-primary`, `--bg-primary`), not shadow.

### Layer 2 — Surface
```css
background: var(--bg-card);     /* or --bg-secondary */
box-shadow: var(--shadow-sm);   /* on hover */
border: none;
```
Applied to: note cards (hover), inline dropdowns, the sidebar itself.

### Layer 3 — Overlay
```css
background: var(--bg-card);
box-shadow: var(--shadow-lg);
border: 1px solid color-mix(in srgb, var(--border-default) 15%, transparent);
```
Applied to: context menus, Quick Switcher, modals, popovers, tooltips.

---

## 4. Z-Index Stack

All z-index values are defined as CSS custom properties. Components must use these tokens — never hardcode a z-index value.

| Token | Value | Layer | Components |
|---|---|---|---|
| `--z-sidebar` | `100` | Sidebar | `.sidebar` (mobile drawer) |
| `--z-overlay` | `200` | Overlay backdrop | `.mobile-overlay` |
| `--z-modal` | `300` | Modal | Modal containers |
| `--z-dropdown` | `350` | Dropdown | Context menus, popovers |
| `--z-toast` | `400` | Toast | Notification toasts |
| `--z-spotlight` | `500` | Spotlight | Quick Switcher |

> Stacking order rationale:
> - Spotlight (`--z-spotlight: 500`) sits above toast notifications because the Quick Switcher is a modal intent that must not be obscured by background notifications.
> - Dropdowns (`--z-dropdown: 350`) sit above modals (`--z-modal: 300`) because context menus can appear inside modal dialogs.

---

## 5. Border Radius Scale

Border radius tokens communicate component "weight" — smaller radii for compact/precise elements, larger for floating/prominent ones.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Toolbar buttons, tags, small badges, code blocks |
| `--radius-md` | `10px` | Note cards, search box, input fields, dropdowns |
| `--radius-lg` | `14px` | Modals, Quick Switcher, notification toasts |
| `--radius-xl` | `20px` | Login card, large modal sheets |
| `--radius-full` | `999px` | Pills (note count badges, tag chips), FAB button |

---

## 6. Accent Glow

The `--accent-glow` shadow is used **only** for brand-colored surfaces that need to visually "emit" their color:

```css
/* Correct usage */
.sidebar-logo    { box-shadow: var(--accent-glow); }
.new-note-btn    { box-shadow: var(--accent-glow), var(--shadow-md); }

/* Incorrect usage — do not apply to text, borders, or content cards */
.note-card.active { box-shadow: var(--accent-glow); }  /* ❌ Too much emphasis */
```

---

## 7. Translucency

Several overlay surfaces use `backdrop-filter: blur()` for a "vibrancy" effect that echoes macOS/iOS translucency:

| Surface | Blur | Background opacity | Token |
|---|---|---|---|
| Quick Switcher backdrop | `blur(2px)` | 45% | `--bg-overlay` |
| Zen mode floating toolbar | `blur(12px)` | 80% | `--bg-secondary` at `0.8` opacity |
| Mobile overlay scrim | `blur(0px)` | per `--bg-overlay` | standard |

> Use translucency sparingly — only for surfaces that must convey spatial depth ("this floats above everything"). Do not apply blur to standard dropdowns.
