# Component Library

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

All components in the Noto design system follow a consistent anatomy:

1. **Overview** — purpose and when to use
2. **Anatomy** — named parts
3. **Variants & States** — all visual permutations
4. **Accessibility** — ARIA, keyboard, VoiceOver
5. **CSS Spec** — exact token references
6. **Code Example** — canonical JSX pattern

---

## Primitive Components (20)

| Component | File | CSS Class | Status |
|---|---|---|---|
| Button | [button.md](button.md) | `.btn` | ✅ Documented |
| Input | [input.md](input.md) | `.form-input` | ✅ Documented |
| Textarea | [textarea.md](textarea.md) | `.form-textarea` | ✅ Documented |
| Checkbox | [checkbox.md](checkbox.md) | `.checkbox` | ✅ Documented |
| Radio | [radio.md](radio.md) | `.radio` | ✅ Documented |
| Switch | [switch.md](switch.md) | `.switch` | ✅ Documented |
| Select | [select.md](select.md) | `.form-select` | ✅ Documented |
| Badge | [badge.md](badge.md) | `.badge` | ✅ Documented |
| Avatar | [avatar.md](avatar.md) | `.avatar` | ✅ Documented |
| Tag (primitive) | [tag.md](tag.md) | `.tag` | ✅ Documented |
| Tooltip | [tooltip.md](tooltip.md) | `.tooltip` | ✅ Documented |
| Popover | [popover.md](popover.md) | `.popover` | ✅ Documented |
| Modal | [modal.md](modal.md) | `.modal` | ✅ Documented |
| Dropdown Menu | [dropdown-menu.md](dropdown-menu.md) | `.dropdown` | ✅ Documented |
| Context Menu | [context-menu.md](context-menu.md) | `.context-menu` | ✅ Documented |
| Divider | [divider.md](divider.md) | `.divider`, `.toolbar-divider` | ✅ Documented |
| Spinner | [spinner.md](spinner.md) | `.spinner` | ✅ Documented |
| Skeleton | [skeleton.md](skeleton.md) | `.skeleton` | ✅ Documented |
| Banner | [banner.md](banner.md) | `.banner` | ✅ Documented |
| Toast | [toast.md](toast.md) | `.toast` | ✅ Documented |

---

## Noto-Specific Components (12)

| Component | File | Source Component | CSS Class |
|---|---|---|---|
| Sidebar Item | [sidebar-item.md](sidebar-item.md) | `Sidebar.jsx` | `.sidebar-item` |
| Note Card | [note-card.md](note-card.md) | `NotesList.jsx` | `.note-card` |
| Notebook Item | [notebook-item.md](notebook-item.md) | `Sidebar.jsx` | `.sidebar-item` + `.para-dot` |
| Kanban Card | [kanban-card.md](kanban-card.md) | `KanbanBoard.jsx` | `.kanban-card` |
| Tag Pill | [tag-pill.md](tag-pill.md) | `TagManager.jsx` | `.editor-tag` |
| Search Box | [search-box.md](search-box.md) | `NotesList.jsx` | `.search-box` |
| Toolbar | [toolbar.md](toolbar.md) | `NoteToolbar.jsx` | `.editor-toolbar` |
| View Mode Toggle | [view-mode-toggle.md](view-mode-toggle.md) | `NoteToolbar.jsx` | `.view-mode-toggle` |
| Empty State | [empty-state.md](empty-state.md) | `EmptyState.jsx` | `.empty-state` |
| Login Card | [login-card.md](login-card.md) | `LoginScreen.jsx` | `.login-card` |
| Quick Switcher | [quick-switcher.md](quick-switcher.md) | `QuickSwitcher.jsx` | `.quick-switcher` |
| Save Indicator | [save-indicator.md](save-indicator.md) | `NoteToolbar.jsx` | `.save-indicator` |

---

## Component States Reference

Every interactive component supports these standard states (unless noted otherwise):

| State | CSS modifier | Description |
|---|---|---|
| Default | — | No interaction |
| Hover | `:hover` | Pointer over element |
| Focus | `:focus-visible` | Keyboard / programmatic focus |
| Active | `:active` or `.active` | Being pressed or currently selected |
| Disabled | `[disabled]` or `.disabled` | Non-interactive, reduced opacity |
| Loading | `.loading` | Async operation in progress |
| Error | `.error` | Validation or system error |
| Success | `.success` | Operation completed successfully |

---

## Anatomy Notation

Component anatomy diagrams use this labelling convention:

```
[A] ─── named part
[B] ─── another part
```

Parts are described as:
- **Container** — outermost bounding box
- **Label** — primary text
- **Description** — secondary text
- **Icon** — decorative or semantic icon
- **Indicator** — state dot, checkmark, or glyph
- **Action** — interactive control within the component
- **Slot** — area where child content is inserted
