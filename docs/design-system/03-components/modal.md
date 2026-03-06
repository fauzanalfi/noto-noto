# Modal

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

A modal dialog blocks the underlying UI and requires the user to complete an action or dismiss before proceeding. Use sparingly — only when the action is critical, destructive, or requires focused input that would be confusing in context.

**When to use:**
- Confirming destructive actions (delete note, empty trash)
- Inserting structured data (Markdown table builder)
- Content that benefits from full focus (settings, onboarding)

**When not to use:**
- Inline editing (just edit in place)
- Information that could be a tooltip or banner
- Navigation (use sidebar or sheets instead)

---

## 2. Anatomy

```
┌──────────────────────── Backdrop (scrim) ───────────────────────┐
│                                                                   │
│     ┌──────────────────── [A: Card] ──────────────────────┐     │
│     │  [B: Header]                              [C: Close] │     │
│     │  ─────────────────────────────────────────────────── │     │
│     │  [D: Body / Slot]                                     │     │
│     │  ─────────────────────────────────────────────────── │     │
│     │  [E: Footer actions]              [Cancel] [Confirm] │     │
│     └───────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

| Part | Description |
|---|---|
| **Backdrop** | Full-viewport scrim, `var(--bg-overlay)`, `z-index: var(--z-modal)`. Click to dismiss (when action is not destructive). |
| **A — Card** | White/dark card, `var(--bg-card)`, `var(--shadow-lg)`, `var(--radius-xl)`. Max-width 480px standard. |
| **B — Header** | Title + optional subtitle. Title uses `--font-size-md`, weight 600. |
| **C — Close** | `×` icon button, top-right. Always present. `aria-label="Close dialog"`. |
| **D — Body** | Content slot. Can contain any component. Vertically scrollable if content overflows. |
| **E — Footer** | Right-aligned action buttons. Canonical order: Cancel (ghost) ← Confirm/Danger (primary/danger). |

---

## 3. Variants

| Variant | Max-width | Usage |
|---|---|---|
| Compact | `360px` | Confirmation dialogs (2-3 lines + 2 buttons) |
| Standard | `480px` | Form modals, Settings panel |
| Wide | `600px` | Table builder, multi-step inputs |
| Sheet (mobile) | `100vw` | Bottom sheet on mobile; slides up from bottom |

---

## 4. States

- **Open:** visible, focus trapped inside, backdrop visible.
- **Closing:** `fadeOut` animation, 150ms, then `display: none`.
- **Confirming (loading):** Confirm button shows spinner, `aria-busy="true"`. Cancel disabled.

---

## 5. Accessibility

- **Role:** `role="dialog"` or `role="alertdialog"` (for destructive confirmations).
- **Label:** `aria-labelledby` pointing to the heading element; `aria-describedby` pointing to body text.
- **Focus trap:** When modal opens, focus moves to the first focusable element inside. Tab cycles within modal only. Focus returns to trigger when closed.
- **Escape key:** Always closes the modal (unless a required field is empty in a form flow — rarely block dismiss).
- **Backdrop click:** Dismisses non-destructive modals. Destructive confirmation modals should NOT dismiss on backdrop click (prevents accidental cancellation of the intent).
- **Screen reader announcement:** Use `aria-live="polite"` for status updates inside modal (e.g., saving state).

---

## 6. CSS Spec

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  animation: var(--anim-fade-in);
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: var(--anim-modal-in);
  overflow: hidden;
}

.modal-header {
  padding: var(--space-xl) var(--space-xl) var(--space-lg);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  gap: var(--space-md);
}

.modal-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.modal-body {
  padding: var(--space-xl);
  flex: 1;
  overflow-y: auto;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

.modal-footer {
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  border-top: 1px solid var(--border-subtle);
}
```

---

## 7. Code Example

```jsx
function ConfirmDeleteModal({ noteName, onConfirm, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        role="alertdialog"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        className="modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="delete-modal-title" className="modal-title">
            Delete note?
          </h2>
          <button
            className="btn btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">
          <p id="delete-modal-desc">
            <strong>{noteName}</strong> will be permanently deleted.
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
```
