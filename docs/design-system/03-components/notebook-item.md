# Notebook Item

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/Sidebar.jsx`, CSS classes `.notebook-item`, `.sidebar-section`

---

## 1. Overview

The Notebook Item is a Sidebar Item specialised for user-created notebooks. It adds a PARA-coloured dot, note count, inline rename state, and a context menu for management actions. Multiple notebooks are grouped under their PARA category sections.

---

## 2. Anatomy

```
┌─── .notebook-item (extends .sidebar-item) ───────────────────────────┐
│  [Active bar] [A: PARA dot] [B: Label or rename input] [C: Count]    │
└──────────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — PARA dot** | 8px, `var(--para-{category})` | See PARA color map in [sidebar-item.md](./sidebar-item.md) |
| **B — Label** | `--font-size-sm`, truncated | Switches to inline `<input>` in rename mode |
| **C — Count** | `--font-size-xs`, `--text-tertiary` | Hidden when `0` |

---

## 3. States

| State | Display |
|---|---|
| Default | Normal sidebar item |
| Hover | Faint `--bg-hover`; show `⋯` overflow icon (right side) |
| Active | `--bg-tertiary` + active bar |
| Renaming | Label replaced by inline text `<input>` |
| Dropping | Dashed `var(--border-accent)` border; `--bg-hover` bg |

---

## 4. Inline Rename

When the user chooses "Rename" from the context menu:

1. The label `<span>` is replaced by `<input type="text" className="notebook-rename-input">`.
2. The input is auto-focused and the current name is pre-selected.
3. `Enter` or `blur` → saves the new name.
4. `Escape` → cancels without saving.

```css
.notebook-rename-input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  padding: 1px var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  outline: none;
  width: 100%;
}
```

---

## 5. Context Menu

Right-click or `⋯` button opens a `ContextMenu` with:

| Item | Icon | Action |
|---|---|---|
| Rename | `Pencil` | Enter inline rename mode |
| Change PARA category | `FolderEdit` | Opens PARA picker sub-menu |
| Delete | `Trash2` (danger) | Confirm modal → delete notebook + notes |

---

## 6. PARA Section Headers

Notebooks are grouped under `<div className="sidebar-section-header">` labels:

```css
.sidebar-section-header {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  user-select: none;
}
```

---

## 7. Accessibility

- Notebook list is a `<ul>` with `role="list"` inside a `<nav>` with `aria-label="Notebooks"`.
- Each notebook is a `<li>` containing a `<button>` with `aria-current="page"` when active.
- The `⋯` overflow button has `aria-label="Notebook options for [name]"` and `aria-haspopup="menu"`.
- In rename mode, the input has `aria-label="Rename notebook"`.

---

## 8. Code Example

```jsx
{isRenaming ? (
  <input
    autoFocus
    className="notebook-rename-input"
    defaultValue={notebook.name}
    onKeyDown={e => {
      if (e.key === 'Enter') submitRename(e.target.value);
      if (e.key === 'Escape') cancelRename();
    }}
    onBlur={e => submitRename(e.target.value)}
    aria-label="Rename notebook"
  />
) : (
  <button
    className={`sidebar-item notebook-item ${isActive ? 'active' : ''}`}
    onClick={() => onSelectNotebook(notebook.id)}
    onContextMenu={e => { e.preventDefault(); openContextMenu(e, notebook); }}
    aria-current={isActive ? 'page' : undefined}
  >
    <span
      className="sidebar-para-dot"
      style={{ background: `var(--para-${notebook.paraCategory})` }}
      aria-hidden="true"
    />
    <span className="sidebar-item-label">{notebook.name}</span>
    {notebook.noteCount > 0 && (
      <span className="sidebar-item-count" aria-label={`${notebook.noteCount} notes`}>
        {notebook.noteCount}
      </span>
    )}
  </button>
)}
```
