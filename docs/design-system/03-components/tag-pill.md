# Tag Pill

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/TagManager.jsx`, `src/components/Editor.jsx`, CSS class `.editor-tag`

---

## 1. Overview

The Tag Pill is a compact interactive label attached to notes. It appears in the inline tag row below the editor, in Note Cards, and in the Tag Manager modal. Tags can be created, clicked to filter, and removed.

---

## 2. Anatomy

```
┌─── .editor-tag ────────────────────┐
│  [A: Hash or label]  [B: × remove] │
└────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **A — Label** | `--font-size-xs`, `--text-accent` | Text truncated at 20 chars |
| **B — Remove button** | `12px`, `--text-tertiary` | Only shown in editable contexts; hidden on read-only note cards |
| Container | `rgba(accent, 0.12)` bg, `--radius-full` | `padding: 2px 8px` |

---

## 3. Variants

| Variant | Description |
|---|---|
| **Default** | Shows label + remove button (editable state) |
| **Read-only** | Label only, no remove button (note card / quick switcher) |
| **Filter active** | Solid `--accent-primary` bg + `--text-on-accent` — used in sidebar tag filter |
| **Add tag** | `+` prefix, dashed border, opens tag input on click |

---

## 4. States

| State | BG | Border | Opacity |
|---|---|---|---|
| Default | `rgba(accent, 0.12)` | none | 1 |
| Hover | `rgba(accent, 0.20)` | none | 1 |
| Focus (keyboard) | `rgba(accent, 0.12)` | `var(--border-accent)` | 1 |
| Remove hover | Remove icon: `var(--color-danger)` | — | — |
| Disabled | — | — | 0.5 |

---

## 5. Tag Input

When adding a new tag, the pill row includes an `<input type="text">` styled as a ghost inline field:

```css
.tag-input {
  font-size: var(--font-size-xs);
  border: none;
  background: transparent;
  outline: none;
  color: var(--text-primary);
  min-width: 80px;
  max-width: 160px;
}
```

Submit: `Enter` key or clicking away. Cancel: `Escape` key.

---

## 6. Accessibility

- Each tag pill that is removable wraps as `<li>` with `role="listitem"`.
- The remove button has `aria-label="Remove tag {tagName}"`.
- The entire tag list has `role="list"` and `aria-label="Tags"`.
- The Add tag button has `aria-label="Add tag"`.

---

## 7. CSS Spec

```css
.editor-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(from var(--accent-primary) r g b / 0.12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-accent);
  cursor: default;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: background var(--transition-fast);
}

.editor-tag:hover {
  background: rgba(from var(--accent-primary) r g b / 0.20);
}

.editor-tag:focus-visible {
  border-color: var(--border-accent);
  outline: none;
}

.editor-tag.active-filter {
  background: var(--accent-primary);
  color: var(--text-on-accent);
}

.editor-tag-remove {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.editor-tag-remove:hover {
  color: var(--color-danger);
}

.editor-tag-add {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border: 1px dashed var(--border-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  cursor: pointer;
  background: transparent;
  transition: all var(--transition-fast);
}

.editor-tag-add:hover {
  border-color: var(--border-accent);
  color: var(--text-accent);
}
```

---

## 8. Code Example

```jsx
<ul className="editor-tags" role="list" aria-label="Tags">
  {tags.map(tag => (
    <li key={tag} className="editor-tag" role="listitem">
      <span className="editor-tag-label">#{tag}</span>
      {editable && (
        <button
          className="editor-tag-remove"
          onClick={() => onRemoveTag(tag)}
          aria-label={`Remove tag ${tag}`}
        >
          <X size={10} />
        </button>
      )}
    </li>
  ))}
  {editable && (
    <li>
      <button
        className="editor-tag-add"
        onClick={onStartAddingTag}
        aria-label="Add tag"
      >
        <Plus size={10} />
        Add tag
      </button>
    </li>
  )}
</ul>
```
