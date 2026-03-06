# Login Card

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026  
> **Source:** `src/components/LoginScreen.jsx`, CSS classes `.login-container`, `.login-card`, `.login-google-btn`

---

## 1. Overview

The Login Card is the full-screen authentication surface. It is presented on first load when the user is unauthenticated. The design follows Apple HIG for identity screens: centered, minimal, focused on a single CTA.

---

## 2. Anatomy

```
┌─── .login-container (full viewport, centred) ────────────────────────────────┐
│                                                                               │
│           [App wordmark / logo]                                               │
│           [Headline: "Your second brain, beautifully organised"]             │
│           [Sub-headline / tagline]                                            │
│                                                                               │
│  ┌─── .login-card ────────────────────────────────────────────────────────┐  │
│  │  [A: Card headline: "Welcome back"]                                    │  │
│  │  [B: Google sign-in button]                                            │  │
│  │  [C: Error message (conditional)]                                      │  │
│  │  [D: Legal footnote]                                                   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

| Part | Token | Notes |
|---|---|---|
| **Container** | `--bg-primary`, flex center | Full `100dvh` |
| **App wordmark** | `--font-size-3xl`, weight 700, `--text-primary` | Logo or text |
| **Tagline** | `--font-size-md`, `--text-secondary` | 1 line |
| **Card** | `--bg-secondary`, `--border-primary` border, `--shadow-xl` | `max-width: 400px`, `--radius-xl` |
| **A — Card headline** | `--font-size-xl`, weight 600, `--text-primary` | "Welcome back" |
| **B — Google button** | `.login-google-btn` | SVG Google logo + label |
| **C — Error** | `--font-size-sm`, `var(--color-danger)` | Shown on auth failure |
| **D — Footnote** | `--font-size-xs`, `--text-muted` | Privacy/terms links |

---

## 3. Google Sign-in Button

```
┌─── .login-google-btn ──────────────────────────────────┐
│  [Google SVG logo]  Sign in with Google                 │
└─────────────────────────────────────────────────────────┘
```

Width: `100%`, height: `44px` (Apple HIG minimum touch target).  
BG: `--bg-tertiary`, hover: `--bg-hover`.  
Icon size: `20px`.

---

## 4. States

| State | Description |
|---|---|
| Idle | Google button enabled, no error shown |
| Loading | Button shows `Loader2` spin icon + "Signing in…" text, `pointer-events: none` |
| Error | Red error banner above button |
| Success | Full-page fade-out, route to main app |

---

## 5. Accessibility

- Login form has `role="main"` as it is the only content on screen.
- Google button has `aria-label="Sign in with Google"`.
- Error message has `role="alert"` and `aria-live="assertive"`.
- Loading state adds `aria-busy="true"` to the button.

---

## 6. CSS Spec

```css
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--space-xl);
  background: var(--bg-primary);
  gap: var(--space-xl);
}

.login-wordmark {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.login-tagline {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  text-align: center;
  margin-top: calc(-1 * var(--space-lg));
}

.login-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.login-card-headline {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.login-google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  height: 44px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.login-google-btn:hover {
  background: var(--bg-hover);
}

.login-google-btn:disabled {
  opacity: 0.6;
  pointer-events: none;
}

.login-error {
  color: var(--color-danger);
  background: var(--color-danger-subtle);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.login-footnote {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
}

.login-footnote a {
  color: var(--text-accent);
  text-decoration: none;
}
```
