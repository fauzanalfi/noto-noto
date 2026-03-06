# Search Box

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/NotesList.jsx`, CSS class `.search-box`, `.search-wrapper`

---

## 1. Overview

The Search Box is a persistent search field at the top of the NotesList panel. It performs live full-text filtering of notes by title and content as the user types. Queries are debounced to 300 ms.

---

## 2. Anatomy

```
┌─── .search-wrapper ──────────────────────────────────────────────┐
│  [A: Search icon]  [B: Input field]  [C: Clear button (×)]       │
└──────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Icon** | `Search` Lucide, 14px, `--text-muted` | Left-aligned inset |
| **B — Input** | `--font-size-sm`, `--text-primary`, `bg: --bg-secondary` | placeholder: `--text-muted` |
| **C — Clear** | `X` Lucide, 14px, `--text-muted` | Visible only when value is non-empty |

---

## 3. States

| State | Border | BG | Icon color |
|---|---|---|---|
| Empty / idle | `var(--border-primary)` | `var(--bg-secondary)` | `--text-muted` |
| Focused | `var(--border-accent)` | `var(--bg-secondary)` | `--text-accent` |
| Has value | `var(--border-accent)` | `var(--bg-secondary)` | `--text-accent` + clear button shown |
| Disabled | `var(--border-primary)` | `var(--bg-primary)` | `--text-muted`, opacity 0.5 |

---

## 4. Behavior

| Event | Action |
|---|---|
| Type | Debounced (300 ms) → `onSearch(value)` |
| `Esc` key | Clear query, return focus to note list |
| Click clear × | Clear query, keep focus in input |
| `⌘F` / `Ctrl+F` | Focus the search box |

---

## 5. Accessibility

- Input has `role="searchbox"`, `aria-label="Search notes"`, and `aria-controls` pointing to the notes list.
- The clear button has `aria-label="Clear search"`.
- When results change, the notes list has `aria-live="polite"` or a visually-hidden result count: `"X notes found"`.

---

## 6. CSS Spec

```css
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: var(--space-sm) var(--space-md);
}

.search-icon {
  position: absolute;
  left: var(--space-sm);
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.search-box {
  width: 100%;
  padding: var(--space-sm) var(--space-md) var(--space-sm) 32px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition-fast);
}

.search-box::placeholder {
  color: var(--text-muted);
}

.search-box:focus {
  border-color: var(--border-accent);
}

.search-clear {
  position: absolute;
  right: var(--space-sm);
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--text-primary);
}
```

---

## 7. Code Example

```jsx
function SearchBox({ value, onChange }) {
  return (
    <div className="search-wrapper">
      <span className="search-icon" aria-hidden="true">
        <Search size={14} />
      </span>
      <input
        type="search"
        className="search-box"
        placeholder="Search notes…"
        value={value}
        onChange={e => onChange(e.target.value)}
        role="searchbox"
        aria-label="Search notes"
        aria-controls="notes-list"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```
