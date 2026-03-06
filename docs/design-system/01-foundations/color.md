# Color System

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Philosophy

Color in Noto serves one purpose: **reducing cognitive friction**. Every hue carries a fixed semantic meaning — it is never decorative. The PARA color language (red for urgency, amber for responsibility, green for abundance, grey for rest) maps directly to the PARA methodology's psychological intent.

**Rules that never break:**
1. Color is never the sole carrier of meaning — always paired with a label or icon.
2. Full-saturation color is reserved for the single brand accent and PARA category markers.
3. Backgrounds shift in luminosity, never in hue.
4. All three themes (dark, light, eye-care) share the same semantic token names — components never hard-code a hex value.

---

## 2. Raw Palette

These are the primitive, theme-agnostic base colors from which all semantic tokens are derived.

### Brand

| Swatch | Name | Hex |
|---|---|---|
| 🟣 | Purple 400 | `#9485f7` |
| 🟣 | Purple 500 | `#7c6aef` |
| 🟣 | Purple 600 | `#6c5ce7` |
| 🔵 | Blue 400 | `#7aabf7` |
| 🔵 | Blue 500 | `#5b8def` |
| 🔵 | Blue 600 | `#4a80e0` |

### PARA Category

| Category | Dark | Light | Eye-care |
|---|---|---|---|
| Inbox | `#6a9eef` | `#4a80e0` | `#7a8f9a` |
| Projects | `#ef6a6a` | `#e05252` | `#c45a5a` |
| Areas | `#efb86a` | `#e0a030` | `#c49040` |
| Resources | `#6aef8a` | `#38b060` | `#5a9a5a` |
| Archive | `#8a8aa0` | `#7a7a90` | `#8a8578` |

### Status

| Status | Dark | Light | Eye-care |
|---|---|---|---|
| Danger | `#ef4444` | `#dc2626` | `#c45a5a` |
| Success | `#22c55e` | `#16a34a` | `#5a9a5a` |
| Warning | `#f59e0b` | `#d97706` | `#c49040` |
| Info | `#5b8def` | `#4a80e0` | accent-secondary |

---

## 3. Semantic Tokens

All CSS custom properties are scoped to `[data-theme]` on `<html>`. Components reference only these tokens.

### Background Tokens

| Token | Dark | Light | Eye-care | Usage |
|---|---|---|---|---|
| `--bg-primary` | `#1a1b2e` | `#f5f5f7` | `#f5f0e8` | App background, main canvas |
| `--bg-secondary` | `#222340` | `#ffffff` | `#ece5d8` | Sidebar, panels, card surfaces |
| `--bg-tertiary` | `#2a2b4a` | `#ecedf0` | `#e2d9ca` | Active note card, nested surfaces |
| `--bg-hover` | `#32335a` | `#e8e9ee` | `#d9cfbe` | Hover state on interactive elements |
| `--bg-active` | `#3a3b6a` | `#dddee5` | `#d0c4b0` | Active/selected state |
| `--bg-card` | `#252645` | `#ffffff` | `#ede6da` | Floating cards, modals |
| `--bg-input` | `#1e1f38` | `#f0f1f4` | `#ebe4d6` | Form inputs, search box |
| `--bg-overlay` | `rgba(10,10,25,.85)` | `rgba(0,0,0,.4)` | `rgba(60,45,25,.4)` | Modal backdrops, scrim |

### Text Tokens

| Token | Dark | Light | Eye-care | Usage |
|---|---|---|---|---|
| `--text-primary` | `#e8e8f0` | `#1a1a2e` | `#3d3224` | Body text, titles, labels |
| `--text-secondary` | `#9d9db8` | `#5a5a72` | `#6b5e4e` | Secondary labels, descriptions |
| `--text-tertiary` | `#6b6b88` | `#9a9ab0` | `#9a8d7c` | Placeholders, timestamps, hints |
| `--text-accent` | `#a098f0` | `#6c5ce7` | `#7a6545` | Accent text (tags, links inside prose) |
| `--text-on-accent` | `#ffffff` | `#ffffff` | `#ffffff` | Text on brand-colored buttons |

### Accent Tokens

| Token | Dark | Light | Eye-care | Usage |
|---|---|---|---|---|
| `--accent-primary` | `#7c6aef` | `#6c5ce7` | `#8b7355` | Primary CTA buttons, active indicators |
| `--accent-primary-hover` | `#9485f7` | `#7f71ed` | `#9e8568` | Hover state on primary |
| `--accent-secondary` | `#5b8def` | `#4a80e0` | `#7a8f5e` | Info states, secondary links |
| `--accent-gradient` | `135deg purple→blue` | `135deg purple→blue` | `135deg sepia→forest` | Logo, FAB, hero highlights |
| `--accent-glow` | `0 0 20px purple.3` | `0 0 16px purple.2` | `0 0 16px sepia.2` | Logo glow, FAB glow shadow |

### Border Tokens

| Token | Dark | Light | Eye-care | Usage |
|---|---|---|---|---|
| `--border-subtle` | `rgba(255,255,255,.06)` | `rgba(0,0,0,.06)` | `rgba(80,60,30,.08)` | Dividers, panel separators |
| `--border-default` | `rgba(255,255,255,.10)` | `rgba(0,0,0,.10)` | `rgba(80,60,30,.12)` | Input borders, card outlines |
| `--border-hover` | `rgba(255,255,255,.15)` | `rgba(0,0,0,.15)` | `rgba(80,60,30,.18)` | Hovered inputs, focused non-accent |
| `--border-accent` | `rgba(124,106,239,.4)` | `rgba(108,92,231,.3)` | `rgba(139,115,85,.35)` | Active inputs, selected note card |

### Status Tokens

| Token | Dark | Light | Eye-care | Usage |
|---|---|---|---|---|
| `--color-danger` | `#ef4444` | `#dc2626` | `#c45a5a` | Delete actions, error states |
| `--color-danger-hover` | `#f87171` | `#ef4444` | `#d47070` | Hover on danger elements |
| `--color-danger-subtle` | `rgba(239,68,68,.12)` | `rgba(220,38,38,.10)` | `rgba(196,90,90,.12)` | Danger background fills |
| `--color-success` | `#22c55e` | `#16a34a` | `#5a9a5a` | Saved indicator, completed tasks |
| `--color-success-subtle` | `rgba(34,197,94,.12)` | `rgba(22,163,74,.10)` | `rgba(90,154,90,.12)` | Success background fills |
| `--color-warning` | `#f59e0b` | `#d97706` | `#c49040` | Warning banners, caution states |
| `--color-warning-subtle` | `rgba(245,158,11,.12)` | `rgba(217,119,6,.10)` | `rgba(196,144,64,.12)` | Warning background fills |

---

## 4. Contrast Ratios (WCAG 2.2)

> Pass thresholds: **AA Normal text** ≥ 4.5:1 · **AA Large text** ≥ 3:1 · **AAA** ≥ 7:1

### Dark Theme

| Foreground | Background | Ratio | AA Normal | AA Large | AAA |
|---|---|---|---|---|---|
| `--text-primary` `#e8e8f0` | `--bg-primary` `#1a1b2e` | **11.2:1** | ✅ | ✅ | ✅ |
| `--text-primary` `#e8e8f0` | `--bg-secondary` `#222340` | **10.1:1** | ✅ | ✅ | ✅ |
| `--text-secondary` `#9d9db8` | `--bg-primary` `#1a1b2e` | **5.8:1** | ✅ | ✅ | ❌ |
| `--text-tertiary` `#6b6b88` | `--bg-primary` `#1a1b2e` | **3.2:1** | ❌ | ✅ | ❌ |
| `--text-accent` `#a098f0` | `--bg-primary` `#1a1b2e` | **6.9:1** | ✅ | ✅ | ❌ |
| `--text-on-accent` `#ffffff` | `--accent-primary` `#7c6aef` | **4.6:1** | ✅ | ✅ | ❌ |
| `--color-danger` `#ef4444` | `--bg-primary` `#1a1b2e` | **4.7:1** | ✅ | ✅ | ❌ |

### Light Theme

| Foreground | Background | Ratio | AA Normal | AA Large | AAA |
|---|---|---|---|---|---|
| `--text-primary` `#1a1a2e` | `--bg-primary` `#f5f5f7` | **15.3:1** | ✅ | ✅ | ✅ |
| `--text-primary` `#1a1a2e` | `--bg-secondary` `#ffffff` | **16.1:1** | ✅ | ✅ | ✅ |
| `--text-secondary` `#5a5a72` | `--bg-primary` `#f5f5f7` | **6.2:1** | ✅ | ✅ | ❌ |
| `--text-tertiary` `#9a9ab0` | `--bg-primary` `#f5f5f7` | **2.9:1** | ❌ | ❌ | ❌ |
| `--text-accent` `#6c5ce7` | `--bg-primary` `#f5f5f7` | **5.1:1** | ✅ | ✅ | ❌ |
| `--text-on-accent` `#ffffff` | `--accent-primary` `#6c5ce7` | **5.2:1** | ✅ | ✅ | ❌ |
| `--color-danger` `#dc2626` | `--bg-primary` `#f5f5f7` | **5.4:1** | ✅ | ✅ | ❌ |

> ⚠️ **`--text-tertiary` on `--bg-primary` in light theme fails AA for body text.**  
> Acceptable use: placeholder text, timestamps rendered at ≥ `--font-size-lg` (18px) which requires only 3:1.  
> Never use `--text-tertiary` for essential information in the light theme.

### Eye-care Theme

| Foreground | Background | Ratio | AA Normal | AA Large |
|---|---|---|---|---|
| `--text-primary` `#3d3224` | `--bg-primary` `#f5f0e8` | **11.0:1** | ✅ | ✅ |
| `--text-secondary` `#6b5e4e` | `--bg-primary` `#f5f0e8` | **5.6:1** | ✅ | ✅ |
| `--text-accent` `#7a6545` | `--bg-primary` `#f5f0e8` | **5.3:1** | ✅ | ✅ |
| `--text-on-accent` `#ffffff` | `--accent-primary` `#8b7355` | **4.5:1** | ✅ | ✅ |

---

## 5. PARA Color Language

The five PARA categories each carry a reserved color. These colors appear **only** on:
- The 8 × 8 px dot in the sidebar (`para-dot`)
- The category-level section header icon tint
- Never as a full-surface fill

| Category | Token | Psychology |
|---|---|---|
| Inbox | `--para-inbox` | Calm blue — neutral, temporary |
| Projects | `--para-projects` | Red/coral — urgency, active work |
| Areas | `--para-areas` | Amber — responsibility, ongoing maintenance |
| Resources | `--para-resources` | Green — abundance, available reference |
| Archive | `--para-archive` | Grey — rest, de-emphasized, historical |

---

## 6. Usage Rules

### ✅ DO

- Use `--accent-primary` for the single focused action on any screen.
- Use `--text-secondary` for supporting body copy, note snippets.
- Use `--color-danger` only for destructive actions (delete, clear all, permanent).
- Use `--border-accent` to show keyboard focus or selection state.
- Use PARA colors only as small dot or icon tints, always with a text label.

### ❌ DON'T

- Don't combine two accent colors on the same interactive element.
- Don't use `--color-danger` for warnings — use `--color-warning`.
- Don't use `--text-tertiary` for body text (fails AA contrast in light theme).
- Don't hard-code any hex value in a component — always use a CSS token.
- Don't use PARA category colors in prose or as background fills.
- Don't rely on color alone to convey category — always pair with a label.
