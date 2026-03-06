# Developer Guide: Theming

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Theme Architecture

Noto ships with three themes: **dark** (default), **light**, and **eyecare** (warm low-contrast). Themes are applied by setting the `data-theme` attribute on `<html>`. CSS custom properties cascade from the appropriate `[data-theme]` block, overriding the `:root` defaults.

```html
<!-- Dark (default) — no attribute needed, `:root` covers this -->
<html>

<!-- Light theme -->
<html data-theme="light">

<!-- Eyecare theme -->
<html data-theme="eyecare">
```

---

## 2. Token Layers

```
:root {
  /* Brand palette — raw static values */
  --purple-400: #a78bfa;

  /* Semantic tokens — default dark theme values */
  --bg-primary: #0f1117;
  --text-primary: #e2e8f0;
  --accent-primary: #7c6aef;
  ... etc
}

[data-theme="light"] {
  /* Semantic overrides for light theme */
  --bg-primary: #ffffff;
  --text-primary: #1a1a2e;
  ...
}

[data-theme="eyecare"] {
  /* Semantic overrides for eyecare theme */
  --bg-primary: #1a1510;
  --text-primary: #e8d5b7;
  ...
}
```

Component styles reference **only semantic tokens** — never brand raw values. This means all 32 components automatically adapt to all three themes with zero additional CSS.

---

## 3. Theme Hook

The `useTheme` hook manages theme state:

```js
// src/hooks/useTheme.js
const { theme, setTheme } = useTheme();
// theme: 'dark' | 'light' | 'eyecare'
```

It:
1. Reads initial theme from `localStorage` (`noto-theme`).
2. Sets `document.documentElement.setAttribute('data-theme', theme)` on change.
3. Persists the selection to `localStorage`.
4. Exports `setTheme(newTheme)` for the Settings panel.

---

## 4. Adding a New Theme

1. Add a new `[data-theme="mytheme"]` block in `src/index.css`.
2. Override all semantic tokens listed in `docs/design-system/01-foundations/color.md`.
3. Add the theme option to the `useTheme` hook's allowed values.
4. Add the theme selector to the Settings panel.
5. Document the new theme's token values in `docs/design-system/02-tokens/tokens.json` under a new `color.semantic.mytheme` group.

Minimum token set to override (**must override all 30**):

```css
[data-theme="mytheme"] {
  /* Backgrounds */
  --bg-primary: ;
  --bg-secondary: ;
  --bg-tertiary: ;
  --bg-hover: ;

  /* Text */
  --text-primary: ;
  --text-secondary: ;
  --text-tertiary: ;
  --text-muted: ;
  --text-accent: ;
  --text-on-accent: ;

  /* Borders */
  --border-primary: ;
  --border-secondary: ;
  --border-accent: ;

  /* Accent */
  --accent-primary: ;
  --accent-hover: ;
  --accent-subtle: ;

  /* Status */
  --color-danger: ;
  --color-danger-hover: ;
  --color-danger-subtle: ;
  --color-success: ;
  --color-success-subtle: ;
  --color-warning: ;
  --color-warning-subtle: ;
  --color-info: ;
  --color-info-subtle: ;

  /* PARA */
  --para-projects: ;
  --para-areas: ;
  --para-resources: ;
  --para-archive: ;
  --para-inbox: ;
}
```

---

## 5. System Preference Auto-detection

The `useTheme` hook can optionally respect `prefers-color-scheme`:

```js
// If no saved theme, fall back to system preference
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = systemPrefersDark ? 'dark' : 'light';
```

This is implemented as an opt-in: the saved `localStorage` value takes priority.

---

## 6. Eyecare Theme Philosophy

The **eyecare** theme is designed for late-night writing sessions. Key properties:
- Warm-tinted background: `#1a1510` (brownish dark)
- Warm text: `#e8d5b7` (paper-like)
- Muted accent: reduced saturation purple to avoid harsh contrast
- Reduced glare: no pure whites; highlights are warm yellows

It should pass WCAG AA contrast ratios (`4.5:1` for normal text) even with lowered contrast.

---

## 7. Dark Mode in Media Queries

Avoid `@media (prefers-color-scheme: dark)` in component CSS. All theme switching goes through the `data-theme` attribute mechanism exclusively. This keeps the source of truth in one place.
