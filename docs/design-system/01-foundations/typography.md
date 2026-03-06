# Typography

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Philosophy

Noto is fundamentally a writing app. Typography is its primary interface. The type system is built around two principles drawn from Apple HIG:

1. **Optical hierarchy over rigid size ratios** — the gap between heading levels is tuned for visual weight, not mathematical intervals.
2. **Reading first, interface second** — body text is 15px (above WCAG's 14px minimum), with 1.6 line-height for sustained reading comfort.

---

## 2. Font Families

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

**`--font-sans`** — Used for all UI chrome: labels, headings, navigation, toolbars, buttons.  
**`--font-mono`** — Used for the markdown editor textarea, inline code, code blocks, and keyboard shortcuts.

> **Loading:** Inter is loaded via system fallbacks on macOS/iOS (`-apple-system`). For custom Inter via Google Fonts, add `<link rel="preconnect">` before the font `<link>` in `index.html`.

---

## 3. Type Scale — 9 Levels

| Token | rem | px | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| `--font-size-xs` | `0.6875rem` | **11px** | 500–600 | 1.4 | Labels, counts, badge text, column headers |
| `--font-size-sm` | `0.8125rem` | **13px** | 400–600 | 1.5 | Note card titles, body copy, toolbar text, snippets |
| `--font-size-base` | `0.9375rem` | **15px** | 400 | 1.6 | Default body, quick-switcher input, markdown rendered prose |
| `--font-size-md` | `1rem` | **16px** | 600 | 1.5 | Panel headings, note-list header, modal titles |
| `--font-size-lg` | `1.125rem` | **18px** | 600–700 | 1.4 | Sidebar brand, section headings, markdown H3 |
| `--font-size-xl` | `1.375rem` | **22px** | 700 | 1.3 | Note title input, login card title, markdown H2 |
| `--font-size-2xl` | `1.75rem` | **28px** | 700 | 1.2 | Markdown H1 in preview, top-level headings |
| `--font-size-3xl` | `2.5rem` | **40px** | 800 | 1.1 | Login hero headline, full-screen empty state |
| *(no token)* | `clamp(2.5rem, 5vw, 4rem)` | **40–64px** | 800 | 1.0 | *(Future: marketing/hero use only)* |

---

## 4. Usage by Context

### Note Title Input
```css
font-size: var(--font-size-xl);  /* 22px */
font-weight: 700;
letter-spacing: -0.3px;
color: var(--text-primary);
```
The largest persistent text in the editor canvas. No border — zero chrome.

### Note Card Title (list view)
```css
font-size: var(--font-size-sm);  /* 13px */
font-weight: 600;
-webkit-line-clamp: 1;
```
Truncated at one line. Weight 600 lifts it above the snippet without scale increase.

### Note Card Snippet
```css
font-size: var(--font-size-xs);  /* 11px */
font-weight: 400;
-webkit-line-clamp: 2;
line-height: 1.5;
color: var(--text-tertiary);
```

### Sidebar Item
```css
font-size: var(--font-size-sm);  /* 13px */
font-weight: 450;
color: var(--text-secondary);
```
Weight 450 (Inter's intermediate weight) reads lighter than 500 — reduces sidebar visual weight.

### Sidebar Section Header
```css
font-size: var(--font-size-xs);  /* 11px */
font-weight: 600;
text-transform: uppercase;
letter-spacing: 1.2px;
color: var(--text-tertiary);
```
All-caps at 11px with extended tracking is the canonical HIG source-list section label treatment.

### Toolbar / Button Label
```css
font-size: var(--font-size-xs);  /* 11px */
font-weight: 500;
```

### Panel Heading
```css
font-size: var(--font-size-md);  /* 16px */
font-weight: 600;
```

### Markdown Textarea (editor)
```css
font-family: var(--font-mono);
font-size: var(--font-size-sm);  /* 13px */
line-height: 1.7;
```
Monospace for predictable column alignment during raw Markdown authoring.

### Markdown Preview Headings
```css
/* H1 */ font-size: var(--font-size-2xl);  /* 28px */
/* H2 */ font-size: var(--font-size-xl);   /* 22px */
/* H3 */ font-size: var(--font-size-lg);   /* 18px */
/* H4 */ font-size: var(--font-size-md);   /* 16px */
```

---

## 5. Responsive Scale

| Level | Desktop | Tablet ≤1024px | Mobile ≤768px |
|---|---|---|---|
| `--font-size-3xl` | 40px | 36px | 28px |
| `--font-size-2xl` | 28px | 24px | 22px |
| `--font-size-xl` | 22px | 20px | 20px |
| `--font-size-lg` | 18px | 18px | 18px |
| `--font-size-base` | 15px | 15px | 15px |
| `--font-size-sm` | 13px | 13px | 13px |
| `--font-size-xs` | 11px | 11px | 11px |

> Mobile reductions are applied via `@media (max-width: 768px)` on the `:root` block for the two largest display sizes only. Body text is never reduced on mobile — HIG requires a minimum 17px for body on iOS, but Noto's 15px is acceptable for a desktop-first app.

---

## 6. Font Weights in Use

| Weight | Value | Usage |
|---|---|---|
| Regular | 400 | Body prose, Markdown preview text |
| Medium | 450 | Sidebar items (Inter-specific weight) |
| Medium | 500 | Toolbar labels, metadata |
| Semi-bold | 600 | Card titles, panel headings, section labels |
| Bold | 700 | Note title input, large headings |
| Extra-bold | 800 | Login headline, brand wordmark |

---

## 7. Line-height Guidelines

| Context | Value | Rationale |
|---|---|---|
| Body prose | `1.6` | Sustained reading; WCAG 1.4.8 recommends ≥ 1.5 |
| Markdown paragraphs | `1.7` | Wider column needs more leading |
| Tight UI labels | `1.4` | Prevents oversized tap targets at small sizes |
| Display headings | `1.1–1.2` | Tight leading for large optical weight |

---

## 8. Accessibility

### Dynamic Type
- All font sizes use `rem` units, so user browser font preferences are respected.
- UI chrome (sidebar labels, toolbar buttons) floors at `11px` (0.6875rem). At 200% browser zoom, these scale to 22px — comfortable.
- Note card snippets use `-webkit-line-clamp: 2`: if the user has a very large system font, the clamp prevents list overflow while maintaining readability.

### Minimum Contrast
- Body text (`--text-primary`) achieves ≥ 10:1 against its background in all three themes — exceeds AAA.
- Secondary text (`--text-secondary`) achieves ≥ 5.8:1 — passes AA Normal text.
- Tertiary text (`--text-tertiary`) achieves 3.2:1 in dark theme (large-text rule applies at ≥ 18px or ≥ 14px bold). **Only use tertiary for timestamps and placeholders — never for meaningful body text in light theme where it fails AA.**

### Kerning
- Title inputs and hero headings use `letter-spacing: -0.3px` to `-1px` — negative tracking at large sizes is optically correct and matches Apple's SF Pro Display usage at ≥ 20pt.
- Never apply negative tracking at `--font-size-base` or below.

---

## 9. Do's & Don'ts

### ✅ DO
- Use `--font-size-xl` (22px) for the note title — it signals primacy without overshadowing the content.
- Use monospace (`--font-mono`) for the editor textarea so Markdown syntax aligns predictably.
- Use `font-weight: 600` + `text-transform: uppercase` + `letter-spacing: 1.2px` for sidebar section labels.

### ❌ DON'T
- Don't use `font-size: 10px` or below — illegible at any zoom level.
- Don't mix `px` literals in component styles — always reference a `--font-size-*` token.
- Don't apply `-webkit-line-clamp` to headings in the editor canvas — headings need to wrap freely.
- Don't set `font-weight: 700` on `--font-size-xs` text — the combination is visually harsh and strains legibility.
