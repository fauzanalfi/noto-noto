# Skeleton

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

Skeletons are placeholder shapes that appear while content is loading. They communicate that content is forthcoming, reducing perceived load time versus a blank screen or a centered spinner.

**Use in:** NotesList (3 skeleton note cards), Sidebar notebook list, Kanban board.

---

## 2. Anatomy

```
┌────────────────────────────────────────────────────┐
│  ████████████████████░░░░░░░   ← title skeleton    │
│  ████████████░░░░░░░░░░░░░░░   ← line 1            │
│  ████░░░░░░░░░░░░░░░░░░░░░░░   ← line 2            │
│  ██░░░░ ██░░░░░                ← meta line         │
└────────────────────────────────────────────────────┘
```

All shapes are `<div>` elements with `.skeleton` applied. A shimmer animation moves across them.

---

## 3. Variants

Use width variations to simulate actual content proportions:

| Shape | Class | Example |
|---|---|---|
| Title line | `.skeleton` `width: 60–80%` | Note card title |
| Body line full | `.skeleton` `width: 100%` | Body text line |
| Body line partial | `.skeleton` `width: 40–70%` | Last line of a paragraph |
| Square | `.skeleton.skeleton-square` | Avatar, icon placeholder |
| Dot | `.skeleton.skeleton-dot` | PARA dot |

---

## 4. Accessibility

- Skeleton containers should have `role="status"` and `aria-label="Loading content"`.
- Screen readers should announce that content is loading without reading the individual skeleton divisions.
- When content loads, focus and announcements should be managed by the parent component.

---

## 5. CSS Spec

```css
.skeleton {
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  height: 12px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--bg-hover) 50%,
    transparent 100%
  );
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-square {
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

@keyframes skeleton-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after { animation: none; }
  .skeleton { animation: none; }
}
```

---

## 6. Note Card Skeleton Example

```jsx
function NoteCardSkeleton() {
  return (
    <div className="note-card" aria-hidden="true">
      <div className="skeleton" style={{ width: '70%', marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '100%', marginBottom: 4 }} />
      <div className="skeleton" style={{ width: '50%', marginBottom: 8 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ width: 40 }} />
        <div className="skeleton" style={{ width: 60 }} />
      </div>
    </div>
  )
}
```
