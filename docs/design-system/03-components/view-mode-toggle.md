# View Mode Toggle

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/NoteToolbar.jsx`, CSS class `.view-mode-toggle`

---

## 1. Overview

The View Mode Toggle is a 4-segment control that switches the editor between Edit, Preview, Split, and Zen modes. It follows the Apple segmented control / tab-bar metaphor: a single horizontal pill with a sliding active background.

---

## 2. Anatomy

```
┌─── .view-mode-toggle ───────────────────────────────────────────┐
│  [Edit]  [Preview]  [Split]  [Zen]                               │
│        ▲ active segment has --bg-tertiary background             │
└─────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| Container | `--bg-secondary` bg, `1px solid var(--border-primary)` | `border-radius: var(--radius-md)` |
| Active segment | `--bg-tertiary` bg | Sliding motion via `transition: all var(--transition-fast)` |
| Label | `--font-size-xs`, weight 500, `--text-secondary` active → `--text-primary` | No icon on desktop; icon-only on mobile |

---

## 3. Modes

| Mode | Label | Icon | Keyboard |
|---|---|---|---|
| Edit | "Edit" | `Pencil` | `⌘1` / `Ctrl+1` |
| Preview | "Preview" | `Eye` | `⌘2` / `Ctrl+2` |
| Split | "Split" | `Columns2` | `⌘3` / `Ctrl+3` |
| Zen | "Zen" | `Maximize2` | `⌘4` / `Ctrl+4` |

---

## 4. States

| State | Segment bg | Label color |
|---|---|---|
| Inactive | `transparent` | `--text-secondary` |
| Hover | `rgba(var(--text-primary-rgb), 0.04)` | `--text-primary` |
| Active | `--bg-tertiary` | `--text-primary` |
| Disabled | `opacity: 0.4`, `pointer-events: none` | `--text-muted` |

---

## 5. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (>1024px) | Show text label + icon |
| Tablet (≤1024px) | Show icon only (text hidden via `sr-only`) |
| Mobile (<768px) | Collapsed to a single icon button that cycles through modes |

---

## 6. Accessibility

- Container has `role="group"` and `aria-label="View mode"`.
- Each button has `aria-pressed="true/false"` reflecting its active state.
- Each button has `aria-label` matching its mode name.
- Keyboard: `←`/`→` moves focus between segments; `Space`/`Enter` activates.

---

## 7. CSS Spec

```css
.view-mode-toggle {
  display: inline-flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 2px;
  gap: 2px;
}

.view-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--space-sm);
  border: none;
  background: transparent;
  border-radius: calc(var(--radius-md) - 2px);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.view-mode-btn:hover {
  color: var(--text-primary);
  background: rgba(0,0,0,0.04);
}

.view-mode-btn.active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 1024px) {
  .view-mode-btn .view-mode-label {
    display: none;
  }
}
```

---

## 8. Code Example

```jsx
const VIEW_MODES = [
  { id: 'edit',    label: 'Edit',    icon: <Pencil size={14} /> },
  { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  { id: 'split',   label: 'Split',   icon: <Columns2 size={14} /> },
  { id: 'zen',     label: 'Zen',     icon: <Maximize2 size={14} /> },
];

function ViewModeToggle({ viewMode, onChange }) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className="view-mode-toggle"
    >
      {VIEW_MODES.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`view-mode-btn ${viewMode === id ? 'active' : ''}`}
          aria-pressed={viewMode === id}
          aria-label={label}
          onClick={() => onChange(id)}
        >
          {icon}
          <span className="view-mode-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
```
