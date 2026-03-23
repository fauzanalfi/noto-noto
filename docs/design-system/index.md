# Noto 3.0 Design System

> **Version:** 3.0 — March 2026  
> **Stack:** React 19 · Vite 7 · Plain CSS · Firebase  
> **Themes:** Dark (default) · Light · Eyecare  
> **Standard:** Apple Human Interface Guidelines · WCAG 2.1 AA

---

## Quick Links

| I want to… | Go to |
|---|---|
| Learn the color vocabulary | [Color System](01-foundations/color.md) |
| Find the right spacing value | [Spacing](01-foundations/spacing.md) |
| Use a design token in CSS | [Tokens JSON](02-tokens/tokens.json) |
| Look up a component | [Component Index](03-components/_index.md) |
| Understand PARA architecture | [PARA Patterns](04-patterns/para-system.md) |
| Set up the dev environment | [Dev Setup](05-dev-guide/setup.md) |
| See all 12 UI screens | [UI Design Spec](06-ui-design.md) |

---

## Noto 3.0 Redesign Direction

- **Creative north star:** The Digital Curator — editorial, calm, and content-first.
- **No-line rule:** section boundaries are defined by tonal surface steps, not visible 1px separators.
- **Tonal depth first:** depth comes from layered surfaces; shadows are reserved for high-priority overlays.
- **Typography split:** UI chrome stays in Inter, while long-form note content adopts a serif voice.
- **Focused motion:** transitions communicate context changes; decorative animation is avoided.

Canonical redesign exploration files live in `stitch_noto_redesign_plan/` and should be treated as visual input for this documentation set.

---

## 01 — Foundations

| File | Description |
|---|---|
| [Color](01-foundations/color.md) | Brand palette, 3-theme semantic tokens, WCAG contrast, PARA color language |
| [Typography](01-foundations/typography.md) | 9-level type scale, usage contexts, responsive rules, accessibility |
| [Spacing](01-foundations/spacing.md) | 8px grid, 8-level scale, component usage guide |
| [Grid](01-foundations/grid.md) | 3-column shell, breakpoints, Zen/Split/Kanban layout modes |
| [Elevation](01-foundations/elevation.md) | Depth model, 5-shadow scale, z-index stack, border radius, translucency |
| [Motion](01-foundations/motion.md) | Transition tokens, animation tokens, 18-entry micro-interaction catalogue |

---

## 02 — Design Tokens

| File | Description |
|---|---|
| [tokens.json](02-tokens/tokens.json) | W3C DTCG format — all ~200 tokens with `$type`, `$value`, `$extensions.cssVar` |

---

## 03 — Components

### Primitive Components

| Component | File |
|---|---|
| Button | [button.md](03-components/button.md) |
| Input | [input.md](03-components/input.md) |
| Textarea | [textarea.md](03-components/textarea.md) |
| Select | [select.md](03-components/select.md) |
| Checkbox | [checkbox.md](03-components/checkbox.md) |
| Radio | [radio.md](03-components/radio.md) |
| Switch | [switch.md](03-components/switch.md) |
| Modal | [modal.md](03-components/modal.md) |
| Toast | [toast.md](03-components/toast.md) |
| Context Menu | [context-menu.md](03-components/context-menu.md) |
| Dropdown Menu | [dropdown-menu.md](03-components/dropdown-menu.md) |
| Popover | [popover.md](03-components/popover.md) |
| Tooltip | [tooltip.md](03-components/tooltip.md) |
| Badge | [badge.md](03-components/badge.md) |
| Tag | [tag.md](03-components/tag.md) |
| Avatar | [avatar.md](03-components/avatar.md) |
| Spinner | [spinner.md](03-components/spinner.md) |
| Skeleton | [skeleton.md](03-components/skeleton.md) |
| Divider | [divider.md](03-components/divider.md) |
| Banner | [banner.md](03-components/banner.md) |

### Noto-Specific Components

| Component | Source file | Doc |
|---|---|---|
| Sidebar Item | `Sidebar.jsx` | [sidebar-item.md](03-components/sidebar-item.md) |
| Notebook Item | `Sidebar.jsx` | [notebook-item.md](03-components/notebook-item.md) |
| Note Card | `NotesList.jsx` | [note-card.md](03-components/note-card.md) |
| Search Box | `NotesList.jsx` | [search-box.md](03-components/search-box.md) |
| Tag Pill | `TagManager.jsx` | [tag-pill.md](03-components/tag-pill.md) |
| Kanban Card | `KanbanBoard.jsx` | [kanban-card.md](03-components/kanban-card.md) |
| Toolbar | `NoteToolbar.jsx` | [toolbar.md](03-components/toolbar.md) |
| View Mode Toggle | `NoteToolbar.jsx` | [view-mode-toggle.md](03-components/view-mode-toggle.md) |
| Save Indicator | `NoteToolbar.jsx` | [save-indicator.md](03-components/save-indicator.md) |
| Empty State | `EmptyState.jsx` | [empty-state.md](03-components/empty-state.md) |
| Login Card | `LoginScreen.jsx` | [login-card.md](03-components/login-card.md) |
| Quick Switcher | `QuickSwitcher.jsx` | [quick-switcher.md](03-components/quick-switcher.md) |

---

## 04 — Patterns

| File | Description |
|---|---|
| [Navigation](04-patterns/navigation.md) | Shell layout, responsive modes, keyboard map, focus management |
| [PARA System](04-patterns/para-system.md) | Category reference, visual grammar, Inbox, Archive behaviour |
| [Data Entry](04-patterns/data-entry.md) | Inline editing, modal forms, save flow, validation, destructive actions |
| [Content Display](04-patterns/content-display.md) | NotesList, Markdown Preview, Split view, Kanban, Tasks, loading/error states |

---

## 05 — Developer Guide

| File | Description |
|---|---|
| [Setup](05-dev-guide/setup.md) | Prerequisites, installation, env vars, scripts, project structure |
| [Theming](05-dev-guide/theming.md) | Theme architecture, `useTheme` hook, adding a new theme, token layers |
| [Accessibility](05-dev-guide/accessibility.md) | WCAG targets, contrast table, keyboard rules, ARIA guide, focus management |
| [Do's and Don'ts](05-dev-guide/dos-donts.md) | Canonical rules for tokens, CSS, components, a11y, animation, Firebase |

---

## 06 — UI Design

| File | Description |
|---|---|
| [UI Design Spec](06-ui-design.md) | Apple HIG full UI — 12 screens each with ASCII wireframe + spec table, micro-interactions, accessibility spec, responsive matrix, Designer's Notes |

---

## Design Principles

1. **Substance over chrome** — every visible pixel earns its place
2. **Hierarchy through restraint** — typography and spacing carry all hierarchy; color is status + identity + accent only
3. **Fluency over features** — power users operate through keyboard shortcuts, not menus
4. **Editorial focus** — reading and writing comfort takes precedence over dashboard density

---

## CSS Custom Properties Reference

All tokens in `src/index.css`. Quick reference:

```css
/* Backgrounds */
--bg-primary  --bg-secondary  --bg-tertiary  --bg-hover

/* Text */
--text-primary  --text-secondary  --text-tertiary  --text-muted  --text-accent  --text-on-accent

/* Borders */
--border-primary  --border-secondary  --border-accent

/* Accent */
--accent-primary  --accent-hover  --accent-subtle

/* Status */
--color-danger  --color-success  --color-warning  --color-info
(+ -hover, -subtle variants for each)

/* PARA */
--para-projects  --para-areas  --para-resources  --para-archive  --para-inbox

/* Typography */
--font-sans  --font-mono
--font-size-xs  sm  base  md  lg  xl  2xl  3xl  (+ fluid variants)

/* Spacing (8px grid) */
--space-xs(4)  sm(8)  md(12)  lg(16)  xl(24)  2xl(32)  3xl(48)  4xl(64)

/* Radius */
--radius-sm  md  lg  xl  full

/* Shadow */
--shadow-sm  md  lg  xl

/* Motion */
--transition-fast(120ms)  normal(200ms)  slow(300ms)
--ease-spring

/* Z-index */
--z-base  raised  dropdown  sticky  overlay  modal  spotlight  toast
```
