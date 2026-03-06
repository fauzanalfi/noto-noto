# Toolbar (Note Toolbar)

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/NoteToolbar.jsx`, CSS class `.editor-toolbar`

---

## 1. Overview

The Note Toolbar is a horizontal action bar anchored to the top of the Editor pane. It contextually shows formatting tools (Edit mode), the view-mode toggle, the note title breadcrumb, and the save indicator.

---

## 2. Anatomy

```
┌─── .editor-toolbar ──────────────────────────────────────────────────────────┐
│  [A: Back / Menu toggle]  [B: Breadcrumb]  →  [C: View toggle]  [D: Overflow] │
│                                               [E: Formatting group]           │
│                                               [F: Save indicator]             │
│                                               [G: Delete / Trash]             │
└──────────────────────────────────────────────────────────────────────────────┘
```

| Part | Token / Notes |
|---|---|
| **A — Menu toggle** | Visible on mobile (≤768px), `btn-icon`, `Menu` icon opens Sidebar |
| **B — Breadcrumb** | `--font-size-sm`, `--text-tertiary`, formatted as "Notebook / Note title" |
| **C — View toggle** | `.view-mode-toggle` — Edit / Preview / Split / Zen |
| **D — Overflow menu** | `MoreHorizontal` icon, opens dropdown on mobile for actions |
| **E — Formatting group** | Bold, Italic, Heading, list buttons — only visible in Edit mode |
| **F — Save indicator** | `.save-status` chip |
| **G — Trash** | `Trash2` icon, `color: var(--color-danger)` |

---

## 3. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (>1024px) | Show all parts: breadcrumb + toggle + formatting + save + trash |
| Tablet (768–1024px) | Hide formatting group; show overflow menu |
| Mobile (<768px) | Show back button + overflow menu only; full toolbar in overlay |

---

## 4. Formatting Group Buttons

Available only while in Edit mode (`viewMode === 'edit'`):

| Button | Icon | Action | Markdown inserted |
|---|---|---|---|
| Bold | `Bold` | Wrap selection in `**` | `**text**` |
| Italic | `Italic` | Wrap selection in `_` | `_text_` |
| H1 | `Heading1` | Prefix line with `# ` | `# ` |
| Unordered list | `List` | Prefix line with `- ` | `- ` |
| Ordered list | `ListOrdered` | Prefix line with `1. ` | `1. ` |
| Code block | `Code2` | Wrap in ` ``` ` | ` ```\n\n``` ` |
| Horizontal rule | `Minus` | Insert `---` | `---` |

---

## 5. Accessibility

- Each icon button has `aria-label` describing the action (e.g., `aria-label="Bold"`).
- Formatting buttons have `aria-pressed` reflecting active state.
- The toolbar itself has `role="toolbar"` and `aria-label="Note editor toolbar"`.
- Keyboard navigation within toolbar: `←`/`→` moves focus between toolbar buttons.

---

## 6. CSS Spec

```css
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  height: 44px;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 var(--space-sm);
  border-right: 1px solid var(--border-primary);
}

.toolbar-group:last-of-type {
  border-right: none;
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background: var(--border-primary);
  margin: 0 var(--space-xs);
}

.toolbar-spacer {
  flex: 1;
}

.toolbar-breadcrumb {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.toolbar-trash-btn {
  color: var(--color-danger) !important;
}
```

---

## 7. Code Example

```jsx
<div
  role="toolbar"
  aria-label="Note editor toolbar"
  className="editor-toolbar"
>
  {/* Mobile back/menu toggle */}
  <button className="btn-icon mobile-only" aria-label="Open sidebar">
    <Menu size={18} />
  </button>

  {/* Breadcrumb */}
  <span className="toolbar-breadcrumb">
    {notebookName} / {noteTitle}
  </span>

  <div className="toolbar-spacer" />

  {/* Formatting group — edit mode only */}
  {viewMode === 'edit' && (
    <div className="toolbar-group" role="group" aria-label="Text formatting">
      <button className="btn-icon" aria-label="Bold" onClick={() => insertMarkdown('bold')}>
        <Bold size={16} />
      </button>
      <button className="btn-icon" aria-label="Italic" onClick={() => insertMarkdown('italic')}>
        <Italic size={16} />
      </button>
    </div>
  )}

  {/* View mode toggle */}
  <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

  {/* Save indicator */}
  <SaveIndicator status={saveStatus} />

  {/* Delete */}
  <button
    className="btn-icon toolbar-trash-btn"
    aria-label="Delete note"
    onClick={onDelete}
    style={{ color: 'var(--color-danger)' }}
  >
    <Trash2 size={16} />
  </button>
</div>
```
