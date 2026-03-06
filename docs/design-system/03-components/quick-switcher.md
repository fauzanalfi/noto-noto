# Quick Switcher

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/QuickSwitcher.jsx`, CSS classes `.quick-switcher-overlay`, `.quick-switcher`

---

## 1. Overview

The Quick Switcher is a keyboard-first Spotlight-style palette for instantly jumping to any note, notebook, or action. It appears as a centred floating panel over a blurred backdrop.

---

## 2. Anatomy

```
┌─── .quick-switcher-overlay ──────────────────────────────────────────────┐
│  (full-screen backdrop, click-to-dismiss)                                 │
│                                                                           │
│  ┌─── .quick-switcher ──────────────────────────────────────────────┐    │
│  │  [A: Search Input: ┌─────────────────────────────────────────┐]  │    │
│  │                    │  🔍  Type to search...          ⌘K  esc │    │    │
│  │                    └─────────────────────────────────────────┘    │    │
│  │  ─── Divider ───────────────────────────────────────────────────  │    │
│  │  [B: Result row]  [Icon]  Note title  [Notebook badge]            │    │
│  │  [B: Result row — active ►]                                       │    │
│  │  [B: Result row]                                                  │    │
│  │  [C: Footer hint]  ↑↓ navigate  ↵ open  esc close               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
```

| Part | CSS class | Token |
|---|---|---|
| **A — Input** | `.quick-switcher-input` | `--bg-secondary`, `--font-size-md`, `--text-primary` |
| **B — Result row** | `.quick-switcher-item` | `--text-primary`, `14px` — active bg: `--bg-tertiary` |
| **Notebook badge** | `.quick-switcher-notebook` | `--font-size-xs`, `--text-tertiary` |
| **C — Footer** | `.quick-switcher-footer` | `--font-size-xs`, `--text-muted` |

---

## 3. Variants

| Variant | Description |
|---|---|
| **Notes search** | Default — searches note titles + content |
| **Commands** | `>` prefix — shows available commands (future) |
| **Empty** | No query → show recent/pinned notes |
| **No results** | Show "No notes found for '…'" message |

---

## 4. States

| State | Description |
|---|---|
| Hidden | `display: none` — default |
| Open | Fade-in + scale-in animation: `animation: var(--anim-fade-in)` |
| Typing | Live filter, no debounce |
| Result highlighted | Mouse hover or keyboard `↑`/`↓` highlights row |
| Dismissing | Fade out on `Esc` or backdrop click |

---

## 5. Positioning & z-index

| Layer | Value |
|---|---|
| Overlay z-index | `calc(var(--z-spotlight) - 1)` = `499` |
| Panel z-index | `var(--z-spotlight)` = `500` |
| Panel position | Fixed, centered: `top: 20vh; left: 50%; transform: translateX(-50%)` |
| Panel max-width | `560px` |
| Panel max-height | `70vh` |

---

## 6. Keyboard Navigation

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open Quick Switcher |
| `↑` / `↓` | Move highlighted result |
| `Enter` | Open highlighted note |
| `Esc` | Close without selecting |
| `Tab` | Cycle through result rows (focus-management fallback) |

---

## 7. Accessibility

- Overlay has `role="dialog"`, `aria-modal="true"`, `aria-label="Quick Switcher"`.
- Search input has `aria-autocomplete="list"`, `aria-controls="quick-switcher-results"`, `aria-activedescendant` pointing to active row ID.
- Results list has `role="listbox"` with `id="quick-switcher-results"`.
- Each result row has `role="option"`, `aria-selected` on the highlighted item.
- Focus is trapped inside the panel while open. On close, focus returns to the previously focused element.

---

## 8. CSS Spec

```css
.quick-switcher-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: calc(var(--z-spotlight) - 1);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
}

.quick-switcher {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 560px;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: var(--anim-fade-in);
  z-index: var(--z-spotlight);
}

.quick-switcher-input {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-md);
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  width: 100%;
}

.quick-switcher-results {
  overflow-y: auto;
  max-height: 400px;
}

.quick-switcher-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  transition: background var(--transition-fast);
}

.quick-switcher-item:hover,
.quick-switcher-item.highlighted {
  background: var(--bg-tertiary);
}

.quick-switcher-notebook {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.quick-switcher-footer {
  border-top: 1px solid var(--border-primary);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  display: flex;
  gap: var(--space-md);
}
```

---

## 9. Code Example

```jsx
{isOpen && (
  <div
    className="quick-switcher-overlay"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Quick Switcher"
  >
    <div
      className="quick-switcher"
      onClick={e => e.stopPropagation()}
    >
      <input
        autoFocus
        className="quick-switcher-input"
        placeholder="Search notes…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-autocomplete="list"
        aria-controls="quick-switcher-results"
        aria-activedescendant={`qs-item-${activeIndex}`}
      />
      <ul
        id="quick-switcher-results"
        className="quick-switcher-results"
        role="listbox"
      >
        {results.map((note, i) => (
          <li
            key={note.id}
            id={`qs-item-${i}`}
            className={`quick-switcher-item ${i === activeIndex ? 'highlighted' : ''}`}
            role="option"
            aria-selected={i === activeIndex}
            onClick={() => { onSelect(note); onClose(); }}
          >
            <FileText size={14} aria-hidden="true" />
            <span>{note.title || 'Untitled'}</span>
            <span className="quick-switcher-notebook">{note.notebookName}</span>
          </li>
        ))}
      </ul>
      <div className="quick-switcher-footer" aria-hidden="true">
        <span>↑↓ navigate</span>
        <span>↵ open</span>
        <span>esc close</span>
      </div>
    </div>
  </div>
)}
```
