# Developer Guide: Accessibility

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Accessibility Standards

Noto targets **WCAG 2.1 Level AA** compliance. All new features must meet this baseline before shipping.

---

## 2. Color Contrast

| Text type | Minimum ratio | Target ratio |
|---|---|---|
| Normal text (< 18pt / 14pt bold) | 4.5:1 | 7:1 |
| Large text (≥ 18pt / 14pt bold) | 3:1 | 4.5:1 |
| UI components (borders, icons) | 3:1 | 4.5:1 |

Verified contrast pairs for dark theme:

| Pair | Ratio |
|---|---|
| `--text-primary` on `--bg-primary` | ≥ 12:1 |
| `--text-secondary` on `--bg-primary` | ≥ 7:1 |
| `--text-tertiary` on `--bg-primary` | ≥ 4.5:1 |
| `--accent-primary` on `--bg-primary` | ≥ 4.5:1 |

Tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/), [Polypane A11y panel](https://polypane.app/).

---

## 3. Keyboard Navigation

Every interactive element must be reachable and operable with keyboard only.

| Requirement | Implementation |
|---|---|
| Focus visible on all focusable elements | `:focus-visible` ring: `2px solid var(--accent-primary)`, `outline-offset: 2px` (in `:root`) |
| No focus trap outside modals | Only Modal and Quick Switcher trap focus |
| Tab order reflects visual order | Never `tabindex > 0` |
| Skip link | `<a href="#main-content" className="skip-link">Skip to main content</a>` before app root |
| Escape closes overlays | Quick Switcher, modals, context menus |

---

## 4. Screen Reader Guidelines

### 4.1 Semantic HTML

Always prefer semantic elements over ARIA:

| UI element | Use |
|---|---|
| Navigation | `<nav aria-label="…">` |
| Lists | `<ul>` / `<ol>` / `<li>` |
| Buttons | `<button>` (not `<div onClick>`) |
| Headings | `<h1>`–`<h6>` in logical order |
| Current page | `aria-current="page"` on active nav item |
| Forms | `<form>`, `<label for>`, `<input id>` |

### 4.2 ARIA Usage Rules

- **ARIA last resort:** use only when semantic HTML is insufficient.
- `aria-label` on icon-only buttons (e.g., `aria-label="Delete note"`).
- `aria-live="polite"` on Save Indicator and search result count.
- `aria-live="assertive"` only on authentication errors.
- `aria-hidden="true"` on all decorative icons.
- `role="dialog"` + `aria-modal="true"` on modals.
- `role="status"` on the Save Indicator.

### 4.3 Dynamic Content Announcements

| Event | Live region type |
|---|---|
| Save state change | `aria-live="polite"` |
| Auth error | `aria-live="assertive"` |
| Note count update | `aria-live="polite"` on result count |
| Toast notification | `role="alert"` / `aria-live="assertive"` (errors), `aria-live="polite"` (success) |

---

## 5. Motion and Animation

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

This override is already present in `src/index.css`. When adding new animations:
1. Always use CSS transitions/animations with tokens (`var(--transition-*)`, `var(--anim-*)`).
2. The global `prefers-reduced-motion` override applies automatically.
3. For spinner/loaders: add an explicit fallback (`animation: none`) inside the media query for clarity.

---

## 6. Focus Management in React

When opening or closing overlays, always manage focus programmatically:

```jsx
// Opening a modal
useEffect(() => {
  if (isOpen) {
    // Move focus to modal
    modalRef.current?.querySelector('[data-autofocus]')?.focus();
  }
}, [isOpen]);

// Closing a modal — return focus to trigger
const triggerRef = useRef(null);
const handleClose = () => {
  setIsOpen(false);
  triggerRef.current?.focus();
};
```

---

## 7. Touch Target Sizes

All interactive elements must have a minimum touch target of **44×44px** (Apple HIG, WCAG 2.5.5 AAA guideline).

For smaller visual button sizes, use padding or an invisible touch expansion:

```css
.btn-icon {
  /* Visual: 28×28 */
  width: 28px;
  height: 28px;
  /* Expand touch target to 44×44 */
  position: relative;
}

.btn-icon::before {
  content: '';
  position: absolute;
  inset: -8px;
}
```

---

## 8. Testing Accessibility

| Tool | Usage |
|---|---|
| [axe DevTools](https://www.deque.com/axe/) | Chrome extension — automated audits |
| [NVDA](https://www.nvaccess.org/) (Windows) | Screen reader smoke test |
| [VoiceOver](https://www.apple.com/accessibility/vision/) (macOS) | Screen reader smoke test |
| Keyboard-only test | Navigate entire app without a mouse |
| Polypane | Multi-viewport + a11y panel |

Run axe before every PR. Fix all critical and serious violations before merge.
