# Motion & Animation

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Philosophy

Motion in Noto follows two Apple HIG principles:

1. **Motion should be purposeful, not decorative.** Every animation communicates a state change — it is never applied purely for visual flair.
2. **Duration should match the weight of the change.** A button hover is lighter than a modal opening; they have different durations.

---

## 2. Transition Tokens

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `120ms ease` | Hover states, button active, focus ring, opacity toggles |
| `--transition-normal` | `200ms ease` | Component state changes, select toggles, minor reflows |
| `--transition-slow` | `350ms cubic-bezier(0.4, 0, 0.2, 1)` | Panel sliding, sidebar open/close, zen mode enter/exit |

**The cubic-bezier for slow transitions** (`0.4, 0, 0.2, 1`) is Material Design's "standard" curve — it eases in quickly and eases out slowly, giving a sense of physical momentum. It matches iOS's spring-like panel transitions.

---

## 3. Animation Tokens

```css
--anim-fade-in:       fadeIn 150ms ease forwards;
--anim-fade-out:      fadeOut 150ms ease forwards;
--anim-modal-in:      slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
--anim-slide-in-left: slideInLeft 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
```

These map to the global keyframe definitions in `src/index.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

---

## 4. Micro-Interaction Catalogue

| Interaction | Trigger | Animation | Duration | Token |
|---|---|---|---|---|
| Note card hover lift | `mouseenter` | `translateY(-1px)` + shadow elevation | `120ms` | `--transition-fast` |
| Sidebar item select | `click` | background fill to `--bg-active` | `120ms` | `--transition-fast` |
| New note FAB tap | `click` | scale `0.92 → 1.0` (spring) | `200ms` | `--transition-normal` |
| Toolbar button hover | `mouseenter` | background fill to `--bg-hover` | `120ms` | `--transition-fast` |
| Toolbar button active | `mousedown` | scale `0.95` | `80ms` | instant out |
| Checkbox complete | `click` | SVG stroke draw + text fade to tertiary | `150ms + 200ms` | custom |
| Zen mode enter | `click` | sidebar/NotesList `slideInLeft` reverse + editor `fadeIn` | `350ms` staggered 80ms | `--transition-slow` |
| Zen mode exit | `click` | reverse of enter, staggered | `300ms` | `--transition-slow` |
| Toast appear | auto | `slideUp` 8px + `fadeIn` | `200ms` | `--anim-modal-in` |
| Toast dismiss | auto/click | `fadeOut` + height collapse | `200ms` | `--anim-fade-out` |
| Kanban card drag start | `dragstart` | `scale(1.02)` + `rotate(4deg)` + shadow-xl | `120ms` | `--transition-fast` |
| Kanban card drop | `drop` | spring snap back to grid | `250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` | custom spring |
| Quick Switcher open | ⌘K / click | backdrop `fadeIn` + card `slideUp` from `scale(0.96)` | `180ms ease-out` | custom |
| Quick Switcher close | Esc / backdrop click | reverse, `150ms ease-in` | `150ms` | custom |
| Tag remove | click `×` | tag width collapses to `0` with `overflow: hidden` | `120ms ease-in` | `--transition-fast` |
| Inline tag add | Enter press | new tag slides in from right | `150ms` | `--transition-fast` |
| Save indicator show | autosave | "Saved" `fadeIn` → 1.5s hold → `fadeOut` | `150ms + 1500ms + 150ms` | `--anim-fade-in` |
| Theme switch | click | **No transition** (instant) | `0ms` | — |
| Focus ring appear | `:focus-visible` | `outline` appears instantly | instant | — |
| Note card delete (mobile swipe) | swipe-left | card slides left, red action reveals | `200ms ease` | `--transition-normal` |
| Panel open/close (mobile sidebar) | hamburger click | drawer `translateX(-100% → 0)` | `350ms` | `--transition-slow` |

---

## 5. Duration Principles

| Category | Duration range | Rationale |
|---|---|---|
| Micro / state | `80–150ms` | Hover, focus, tab interaction — must feel instant |
| Component | `150–250ms` | Card lift, modal enter, toast — noticeable but not slow |
| Layout | `300–400ms` | Panel slide, zen mode — heavy spatial change needs tangible time |
| Never | `> 500ms` | Anything longer feels broken or laggy in a productivity tool |

---

## 6. Easing Guide

| Easing | Curve | When to use |
|---|---|---|
| `ease` | Standard CSS | General hover/state transitions |
| `ease-out` | Decelerates | Elements entering the screen (feel natural, gravity) |
| `ease-in` | Accelerates | Elements leaving the screen (feel like they're dismissed) |
| `cubic-bezier(0.4, 0, 0.2, 1)` | "Standard" | Panel slides, spatial transitions |
| `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | "Spring" | Drop targets, playful snaps (Kanban drop) |

---

## 7. Reduced Motion

All animations must respect `prefers-reduced-motion`. Noto applies a global override in `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

With this rule, all transitions collapse to effectively instant without removing the functional state changes. The UI remains fully usable for users with vestibular disorders, ADHD, or motion sensitivity.

---

## 8. Theme Switch Exception

Theme switching is deliberately **instant** (no transition). Reasons:
- Animated color morphing across 28+ CSS variable changes produces jarring intermediate states.
- The HIG advises against "gratuitous animation" — a theme switch is a user setting change, not a content transition.
- Instant switching is consistent with macOS appearance switching behavior at the system level.

---

## 9. Do's & Don'ts

### ✅ DO
- Use `--transition-fast` for hover states — users interact with hover at high frequency; delays accumulate into perceived sluggishness.
- Stagger sibling entries: if multiple items animate in together (e.g., sidebar sections loading), add 30–50ms stagger delay per item.
- Use `ease-out` for entering elements, `ease-in` for exiting.

### ❌ DON'T
- Don't animate `width`, `height`, or `padding` — they cause reflows; use `transform` and `opacity` instead.
- Don't add animations to `:focus` or `:hover` without providing a `prefers-reduced-motion` fallback.
- Don't use looping animations in the UI (spinners are the exception and should use `step-start` easing for accessibility).
- Don't exceed 400ms for any UI motion inside a productivity tool.
