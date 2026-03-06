# Avatar

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

The Avatar displays the signed-in user's profile photo — or their initials as a fallback — in the Sidebar footer.

---

## 2. Anatomy

```
┌── .avatar ──┐
│  [Photo]    │
│  or [AB]   │
└─────────────┘
```

| Part | Token |
|---|---|
| Container | Circle, `var(--radius-full)` |
| Photo | `<img>`, `object-fit: cover` |
| Initials fallback | `--accent-primary` bg, `--text-on-accent`, `--font-size-xs`, weight 600 |

---

## 3. Sizes

| Size token | Dimension | Usage |
|---|---|---|
| `sm` | `24×24px` | Sidebar footer, compact views |
| `md` | `32×32px` | Comment threads (future) |
| `lg` | `48×48px` | Settings panel, profile page |

---

## 4. States

| State | Style |
|---|---|
| Loaded | Photo visible |
| Error / no photo | Initials fallback |
| Loading | Skeleton shimmer (`.skeleton` variant) |

---

## 5. Accessibility

- `<img>` has `alt="[User name] avatar"`.
- Initials fallback has `aria-label="[User name]"` on the container.
- If the avatar is a button (e.g., opens account menu) add `aria-haspopup="menu"`.

---

## 6. CSS Spec

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--accent-primary);
  color: var(--text-on-accent);
  font-weight: 600;
  user-select: none;
}

.avatar--sm  { width: 24px; height: 24px; font-size: 0.625rem; }
.avatar--md  { width: 32px; height: 32px; font-size: var(--font-size-xs); }
.avatar--lg  { width: 48px; height: 48px; font-size: var(--font-size-sm); }

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 7. Code Example

```jsx
function Avatar({ user, size = 'sm' }) {
  const [imgError, setImgError] = useState(false);
  const initials = user.displayName
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={`avatar avatar--${size}`} aria-label={user.displayName}>
      {user.photoURL && !imgError ? (
        <img
          src={user.photoURL}
          alt={`${user.displayName} avatar`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
```
