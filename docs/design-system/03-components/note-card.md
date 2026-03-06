# Note Card

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/NotesList.jsx`, CSS class `.note-card`

---

## 1. Overview

The Note Card is the primary navigation unit in the NotesList panel. It summarizes a note's title, preview snippet, metadata, and tags so users can identify and select notes at a glance.

---

## 2. Anatomy

```
┌─── .note-card (container) ───────────────────────────────────┐
│  [A: Pin icon]  (only when note is pinned)                    │
│                                                               │
│  [B: Title]                              [C: Date]           │
│  [D: Snippet]                                                 │
│  [D: Snippet line 2]                                          │
│  [E: Tag 1]  [E: Tag 2]  [E: Tag 3]                          │
└───────────────────────────────────────────────────────────────┘
```

| Part | Token reference | Notes |
|---|---|---|
| **A — Pin icon** | `--accent-primary` (color) | Only renders if `note.pinned === true` |
| **B — Title** | `--font-size-sm`, weight 600, `--text-primary` | `-webkit-line-clamp: 1` |
| **C — Date** | `--font-size-xs`, `--text-tertiary` | Last modified timestamp, formatted relative |
| **D — Snippet** | `--font-size-xs`, `--text-tertiary`, `lh: 1.5` | `-webkit-line-clamp: 2` |
| **E — Tag** | `0.625rem`, `--text-accent`, `rgba(accent, .12)` bg | Rounded pill, max 3 shown |

---

## 3. States

| State | Container | Title | Border |
|---|---|---|---|
| Default | `transparent` bg | `--text-primary` | `transparent` |
| Hover | `--bg-hover` | `--text-primary` | `transparent` |
| Active / selected | `--bg-tertiary` | `--text-primary` | `var(--border-accent)` |
| Drag (Kanban) | `opacity: 0.5` | — | `--border-accent` |

---

## 4. Interaction

| Trigger | Action |
|---|---|
| Click / tap | Select note, update `activeNoteId`, open Editor |
| Right-click | Open `NoteContextMenu` at cursor position |
| Long-press (mobile) | Open `NoteContextMenu` |
| Swipe-left (mobile) | Reveal delete/archive action row |

---

## 5. Accessibility

- Role: `button` or `listitem` depending on implementation. Prefer `<li>` wrapping a `<button>` for list semantics.
- `aria-selected` on the active card (if using `role="option"` inside `role="listbox"`).
- `aria-label` on the card should combine title + notebook name: `aria-label="${note.title}, in ${notebookName}"`.
- The note list container should have `role="list"` and `aria-label="Notes in [notebook name]"`.
- Keyboard: `↑` / `↓` navigate between note cards. `Enter` / `Space` open the note.

---

## 6. CSS Spec

```css
.note-card {
  padding: var(--space-md) var(--space-lg);
  margin: 2px 0;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  position: relative;
}

.note-card:hover {
  background: var(--bg-hover);
}

.note-card.active {
  background: var(--bg-tertiary);
  border-color: var(--border-accent);
}

.note-card-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-card-snippet {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  margin-bottom: 6px;
}

.note-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.note-card-meta .pin-icon {
  color: var(--accent-primary);
}

.note-card-tags {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.note-card-tags .tag {
  font-size: 0.625rem;
  padding: 1px 6px;
  background: rgba(from var(--accent-primary) r g b / 0.12);
  border-radius: var(--radius-full);
  color: var(--text-accent);
}
```

---

## 7. Code Example

```jsx
<li>
  <button
    className={`note-card ${note.id === activeNoteId ? 'active' : ''}`}
    onClick={() => onSelectNote(note.id)}
    onContextMenu={e => { e.preventDefault(); openContextMenu(e, note); }}
    aria-selected={note.id === activeNoteId}
    aria-label={`${note.title || 'Untitled'}, in ${notebookName}`}
  >
    <div className="note-card-title">
      {note.pinned && <Pin size={10} className="pin-icon" aria-hidden="true" />}
      {note.title || 'Untitled'}
    </div>
    <div className="note-card-snippet">{note.content?.slice(0, 120)}</div>
    <div className="note-card-meta">
      <span>{formatRelativeDate(note.updatedAt)}</span>
    </div>
    {note.tags?.length > 0 && (
      <div className="note-card-tags" aria-label="Tags">
        {note.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    )}
  </button>
</li>
```
