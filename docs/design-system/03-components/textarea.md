# Textarea

> **Version:** 1.0 — March 2026

---

## 1. Overview

Multi-line text input. In Noto, the primary textarea is the Markdown editor canvas — a borderless, full-height textarea that is the product's core surface.

---

## 2. Anatomy

Same as Input but without a leading icon; height is variable.

---

## 3. The Markdown Editor Textarea

This is Noto's primary textarea. It is intentionally **zero-chrome** — no visible border, no background, no label chrome:

```css
.markdown-textarea {
  flex: 1;
  width: 100%;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-mono);   /* monospace for raw Markdown */
  font-size: var(--font-size-sm);  /* 13px */
  line-height: 1.7;
  padding: 0 var(--space-xl) var(--space-xl);
  resize: none;
  tab-size: 2;
}

.markdown-textarea::placeholder {
  color: var(--text-tertiary);
}
```

---

## 4. General-purpose Textarea (forms)

```css
.form-textarea {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: 1.6;
  padding: var(--space-md) var(--space-lg);
  resize: vertical;
  min-height: 80px;
  width: 100%;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.form-textarea:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(from var(--accent-primary) r g b / 0.1);
}
```

---

## 5. Accessibility

- Always associate a `<label>` via `for`/`id`.
- For the main editor textarea, provide `aria-label="Note body"`.
- Support `Ctrl+A` (select all), `Tab` for indentation (override must restore focus cycling via `Escape`).
- Do not trap Tab permanently — provide an escape mechanism per WCAG 2.1.2.
