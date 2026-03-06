# Empty State

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/EmptyState.jsx`, CSS class `.empty-state`

---

## 1. Overview

Empty State surfaces when there is no content to display. It is used in three contexts: no notes in a notebook, no search results, and the fresh-install welcome screen. Each variant provides a brief, encouraging message and a contextual action.

---

## 2. Anatomy

```
┌─── .empty-state ─────────────────────────────────────────────┐
│                                                               │
│              [A: Illustration / Icon]                         │
│              [B: Headline]                                    │
│              [C: Sub-text]                                    │
│              [D: Primary CTA button]                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Icon** | `48px`, `--text-muted` stroke | Lucide icon or custom SVG |
| **B — Headline** | `--font-size-lg`, weight 600, `--text-primary` | Short — 3–5 words |
| **C — Sub-text** | `--font-size-sm`, `--text-tertiary`, max-width `320px` | 1–2 sentences |
| **D — CTA** | `btn btn-primary` | Optional; omit if no primary action |

---

## 3. Variants

| Variant | Icon | Headline | Sub-text | CTA |
|---|---|---|---|---|
| **Empty notebook** | `BookOpen` | "No notes yet" | "Create your first note in this notebook." | "+ New Note" |
| **Empty search** | `SearchX` | "No results" | "Try different keywords or browse your notebooks." | — |
| **Fresh install** | `Sparkles` | "Welcome to Noto" | "Start by creating a notebook or opening the Quick Switcher." | "Create Notebook" |
| **Empty trash** | `Trash2` | "Trash is empty" | "Deleted notes appear here before permanent removal." | — |

---

## 4. Layout

- Centre-aligned vertically and horizontally within its container.
- Applied via `display: flex; flex-direction: column; align-items: center; justify-content: center;` on the container.
- Minimum height: `240px` (NotesList panel); `100vh - 56px` (Editor pane full empty).

---

## 5. Accessibility

- The icon is decorative; use `aria-hidden="true"`.
- The region should have `role="status"` or be announced via `aria-live="polite"` when the state is dynamically inserted.
- CTA button follows standard `btn` accessibility rules (focus ring, keyboard activation).

---

## 6. CSS Spec

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-4xl) var(--space-xl);
  text-align: center;
  min-height: 240px;
  color: var(--text-muted);
}

.empty-state-icon {
  color: var(--text-muted);
  opacity: 0.6;
  margin-bottom: var(--space-sm);
}

.empty-state-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.empty-state-description {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  max-width: 320px;
  line-height: 1.6;
  margin: 0;
}

.empty-state-action {
  margin-top: var(--space-sm);
}
```

---

## 7. Code Example

```jsx
export default function EmptyState({ variant = 'notebook', onAction }) {
  const config = {
    notebook: {
      icon: <BookOpen size={48} aria-hidden="true" className="empty-state-icon" />,
      title: 'No notes yet',
      description: 'Create your first note in this notebook.',
      action: { label: '+ New Note', onClick: onAction },
    },
    search: {
      icon: <SearchX size={48} aria-hidden="true" className="empty-state-icon" />,
      title: 'No results',
      description: 'Try different keywords or browse your notebooks.',
      action: null,
    },
    welcome: {
      icon: <Sparkles size={48} aria-hidden="true" className="empty-state-icon" />,
      title: 'Welcome to Noto',
      description: 'Start by creating a notebook or using the Quick Switcher.',
      action: { label: 'Create Notebook', onClick: onAction },
    },
    trash: {
      icon: <Trash2 size={48} aria-hidden="true" className="empty-state-icon" />,
      title: 'Trash is empty',
      description: 'Deleted notes appear here before permanent removal.',
      action: null,
    },
  };

  const { icon, title, description, action } = config[variant];

  return (
    <div className="empty-state" role="status" aria-live="polite">
      {icon}
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-description">{description}</p>
      {action && (
        <div className="empty-state-action">
          <button className="btn btn-primary" onClick={action.onClick}>
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}
```
