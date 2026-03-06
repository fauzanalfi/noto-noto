# Noto — Full UI Design Specification

> **Role:** Apple Principal Designer, Senior UI Designer  
> **Version:** 1.0 — March 2026  
> **Standard:** Apple Human Interface Guidelines (macOS + iOS/iPadOS)

---

## Designer's Philosophy

Noto is built for the *intentional thinker* — someone who writes to think, not thinks to write. The design draws from three influences: the spatial clarity of Apple's apps (Notes, Reminders, Xcode), the density-without-clutter of Notion's sidebar, and the focused fullness of iA Writer's editing surface.

The visual language follows three principles:

**1. Substance over chrome.** Every visible pixel earns its place. There are no gradients for decoration, no shadows for depth, no animations for delight alone. When something moves, it communicates.

**2. Hierarchy through restraint.** Typography scale and spacing carry all the hierarchy. Color is reserved for status (dangerous = red), identity (PARA categories), and accent (interactive). The UI almost disappears when you need to write.

**3. Fluency over features.** Power users don't see the UI — they see the keyboard. `⌘K` for Quick Switcher. `⌘N` for a new note. `⌘1–4` for view modes. The mouse is optional. VoiceOver support is mandatory.

---

## HIG Principles Applied to Noto

### Hierarchy
- **Primary:** Editor — the fullscreen writing surface
- **Secondary:** NotesList — curated navigation within context
- **Tertiary:** Sidebar — global navigation and organisational structure

### Layout Philosophy
- Three-column shell mirrors Apple's split-view paradigm (Finder, Mail, Notes)
- Progressive disclosure: Sidebar → NotesList → Editor
- Context stays visible; navigation never hides the content

### Navigation
- Two modes: spatial (sidebar + click) and temporal (Quick Switcher + keyboard)
- No breadcrumbs needed — the three-column layout is self-contextualising
- Back/forward only on mobile (single-column constraint)

### Platform Rules
- Desktop: keyboard-first, dense, persistent layout
- Tablet: two-column, drawer sidebar, context menus → sheet
- Mobile: one panel at a time, swipe gestures, bottom sheets

---

## 1. Login / Onboarding Screen

### ASCII Wireframe

```
┌─────────────────────────── viewport (100dvh) ───────────────────────────────┐
│                                                                               │
│                                                                               │
│                             ◈  Noto                                          │
│                    Your second brain,                                         │
│                    beautifully organised.                                     │
│                                                                               │
│          ┌──────────────────────────────────────────────────────┐            │
│          │                                                       │            │
│          │   Welcome back                                        │            │
│          │                                                       │            │
│          │   ┌───────────────────────────────────────────────┐  │            │
│          │   │  [G]  Sign in with Google                     │  │            │
│          │   └───────────────────────────────────────────────┘  │            │
│          │                                                       │            │
│          │   [!  Error message — only shown on failure  ]       │            │
│          │                                                       │            │
│          │   By signing in, you agree to our Terms of Service.  │            │
│          └──────────────────────────────────────────────────────┘            │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | CSS class | Dimensions | Token |
|---|---|---|---|
| Viewport | `.login-container` | `100dvh` | `--bg-primary` bg |
| Wordmark | `.login-wordmark` | `--font-size-3xl`, 700 | `--text-primary` |
| Tagline | `.login-tagline` | `--font-size-md` | `--text-secondary` |
| Card | `.login-card` | `max-width: 400px`, 24px padding | `--bg-secondary`, `--shadow-xl`, `--radius-xl` |
| Card headline | `.login-card-headline` | `--font-size-xl`, 600 | `--text-primary` |
| Google button | `.login-google-btn` | `100%` wide, `44px` tall | `--bg-tertiary`, hover: `--bg-hover` |
| Error banner | `.login-error` | Full width | `--color-danger`, `--color-danger-subtle` bg |
| Legal footnote | `.login-footnote` | `--font-size-xs` | `--text-muted` |

### Interaction Notes
- Page loads with card fade-in: `animation: var(--anim-fade-in)`
- Google button shows spinner on click (loading state)
- On success: full-page fade-out → App loads
- Error clears on next sign-in attempt

---

## 2. Desktop Home — Three-Column Shell

### ASCII Wireframe

```
┌── Sidebar (240px) ──────┬── NotesList (300px) ────┬── Editor (flex 1) ──────┐
│  ◈ Noto                 │  [Search: ╭──────────╮]  │ ┌─────────────────────┐ │
│  ───────────────────     │            ╰──────────╯   │ │ Toolbar             │ │
│  ▸ PROJECTS              │  ─ Sort ─── Filter ──     │ │ Notebook/Title      │ │
│    ● Thesis (5)          │                           │ │ [Edit][View][Split] │ │
│    ● Startup MVP (12)    │  ▌ Note Title A            │ └─────────────────────┘ │
│                          │    Snippet preview…       │                         │
│  ▸ AREAS                 │    tag1  tag2   May 10    │  # Note Title           │
│    ● Health Notes (8)    │                           │                         │
│    ● Finance (3)         │  Note Title B             │  Start writing…         │
│                          │    Snippet preview…       │                         │
│  ▸ RESOURCES             │    tag3         May 9     │                         │
│    ● Design Refs (21)    │                           │                         │
│                          │  Note Title C             │                         │
│  ▸ ARCHIVE               │    Snippet…    May 7      │                         │
│    ● Old Projects (6)    │                           │                         │
│                          │                           │                         │
│  ─────────────────────   │                           │                         │
│  ☀ [D] [L] [E]  👤 User  │                           │ #tag1  #tag2  + Add tag │
└──────────────────────────┴───────────────────────────┴─────────────────────────┘
```

### Spec Table

| Zone | Width | Background | Border |
|---|---|---|---|
| Sidebar | `240px`, fixed | `--bg-secondary` | `1px right: --border-primary` |
| NotesList | `280–320px`, fixed | `--bg-primary` | `1px right: --border-primary` |
| Editor | `flex: 1` | `--bg-primary` | none |
| Sidebar footer | `240px`, `44px` tall | `--bg-secondary` | `1px top: --border-primary` |
| Toolbar | full editor width, `44px` | `--bg-primary` | `1px bottom: --border-primary` |
| Tag row | full editor width, `36px` | `--bg-primary` | `1px top: --border-primary` |

### Layout Tokens

| Token | Value |
|---|---|
| `--sidebar-width` | `240px` |
| `--notes-panel-width` | `300px` |
| `--toolbar-height` | `44px` |

---

## 3. Zen Mode — Distraction-Free Editor

### ASCII Wireframe

```
┌─────────────────────────── Full viewport ──────────────────────────────────┐
│                                                                             │
│                                                                             │
│                    ┌── max-width: 720px, centered ──┐                      │
│                    │                                 │                      │
│                    │  # Note Title                   │                      │
│                    │                                 │                      │
│                    │  Lorem ipsum dolor sit amet…    │                      │
│                    │  consectetur adipiscing elit,   │                      │
│                    │  sed do eiusmod tempor…         │                      │
│                    │                                 │                      │
│                    │  ## Section Heading             │                      │
│                    │                                 │                      │
│                    │  More content here.             │                      │
│                    │                                 │                      │
│                    └─────────────────────────────────┘                      │
│                                                                             │
│  [Exit Zen ×]  (appears on mouse move, fades after 2s idle)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Token / Value | Notes |
|---|---|---|
| Background | `--bg-primary` | Full 100dvh |
| Editor container | `max-width: 720px`, H padding `32px` | Centered |
| Font | `--font-sans`, `--font-size-base`, `1.7` line-height | Writing-optimized |
| Exit Zen button | `btn btn-secondary`, `position: fixed`, top-right `24px` | Opacity 0 → 1 on mouse activity |
| Mouse idle timeout | 2000ms → hide chrome | CSS transition on `.zen-chrome` |
| Toolbar | Hidden in Zen mode | Only exit button remains |
| Sidebar + NotesList | Fully hidden | Width collapse animation |

### Transition into Zen
```
User clicks "Zen" in view toggle
→ Sidebar width: 240px → 0   (transition: width 300ms ease)
→ NotesList width: 300px → 0 (transition: width 300ms ease, delay: 50ms)
→ Toolbar: opacity 1 → 0     (transition: opacity 200ms, delay: 200ms)
→ Editor margin/padding expand to centred layout
```

---

## 4. Quick Switcher Overlay

### ASCII Wireframe

```
┌─────────────────────────── Full viewport (backdrop) ───────────────────────┐
│  (dimmed + blur: rgba(0,0,0,0.5), backdrop-filter: blur(4px))               │
│                                                                             │
│         ┌────────────────────────────────────────────────────┐             │
│         │  🔍  Search notes…                            ⌘K   │             │
│         ├────────────────────────────────────────────────────┤             │
│         │  📄  Project Kickoff Notes       Startup MVP       │             │
│         │ ►📄  Design System Spec          Design Refs       │  ← active   │
│         │  📄  Q1 OKRs                     Areas             │             │
│         │  📄  Weekly Review               Inbox             │             │
│         │  📄  React Architecture          Resources         │             │
│         ├────────────────────────────────────────────────────┤             │
│         │  ↑↓ navigate   ↵ open   esc close                  │             │
│         └────────────────────────────────────────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Overlay z-index | `calc(var(--z-spotlight) - 1)` = 499 |
| Panel z-index | `var(--z-spotlight)` = 500 |
| Panel width | `min(560px, 90vw)` |
| Panel position | Fixed, top: `20vh`, centered horizontally |
| Search input height | `48px` |
| Result row height | `40px` |
| Max results shown | 8 (scroll for more) |
| Animation in | `var(--anim-fade-in)` + `translateY(-4px)` → `translateY(0)` |
| Keyboard | `⌘K` open, `↑↓` navigate, `Enter` open, `Esc` close |

---

## 5. Kanban Board

### ASCII Wireframe

```
┌── Sidebar (240px) ──┬── NotesList hidden ─┬── Kanban Board (flex) ──────────┐
│  ...                │                      │  ┌──────────┐┌──────────┐┌─────┐│
│                     │                      │  │  TODO (3) ││IN PROG (1)││DONE ││
│                     │                      │  ├──────────┤├──────────┤├─────┤│
│                     │                      │  │ Card A    ││ Card D   ││Card ││
│                     │                      │  │ snippet   ││ snippet  ││ E   ││
│                     │                      │  │ #tag May  ││ #tag Apr ││     ││
│                     │                      │  │───────────││          ││     ││
│                     │                      │  │ Card B    ││          ││     ││
│                     │                      │  │ snippet   ││          ││     ││
│                     │                      │  │───────────││          ││     ││
│                     │                      │  │ Card C    ││          ││     ││
│                     │                      │  │───────────││          ││     ││
│                     │                      │  │ + Add card││          ││     ││
│                     │                      │  └──────────┘└──────────┘└─────┘│
└─────────────────────┴──────────────────────┴────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Board layout | `display: flex; gap: --space-lg; overflow-x: auto; padding: --space-lg` |
| Column width | `min(280px, 90vw)`, max `320px` |
| Column bg | `--bg-secondary` |
| Column header | `--font-size-xs`, uppercase, `--text-tertiary` |
| Card bg | `--bg-primary` |
| Card hover | `border-color: --border-accent` |
| Dragging card | `opacity: 0.5`, `cursor: grabbing`, `--shadow-lg` |
| Drop-zone column | `background: --bg-hover; border: 1px dashed --border-accent` |
| Drop animation | `card-drop-spring` keyframe: `scale(1.02)` → `scale(1)` |

---

## 6. Tasks View

### ASCII Wireframe

```
┌── Sidebar ──────────┬── NotesList hidden ─┬── Tasks (flex) ─────────────────┐
│  ...                │                      │  Tasks in "Startup MVP"          │
│                     │                      │  ─────────────────────────────   │
│                     │                      │                                  │
│                     │                      │  ▾ Project Kickoff Notes (2)     │
│                     │                      │  ☐  Define MVP scope             │
│                     │                      │  ☐  Create landing page          │
│                     │                      │                                  │
│                     │                      │  ▾ Weekly Review (1)             │
│                     │                      │  ☑  Review last week's OKRs     │
│                     │                      │     ~~strikethrough style~~       │
│                     │                      │                                  │
│                     │                      │  ──────────────────────────────  │
│                     │                      │  2 tasks remaining · 1 done      │
└─────────────────────┴──────────────────────┴──────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Task row height | `40px` |
| Checkbox size | `16px`, custom styled `<input type="checkbox">` |
| Completed text | `text-decoration: line-through`, `--text-tertiary` |
| Group header | `--font-size-xs`, uppercase, `--text-muted`, collapsible `▾` toggle |
| Task toggle | Click → patch `- [ ]` → `- [x]` in Markdown → auto-save |
| Summary bar | Fixed bottom, `--font-size-xs`, `--text-tertiary` |
| Empty state | "No tasks found. Add `- [ ] task` in any note." |

---

## 7. Mobile Home (< 768px)

### ASCII Wireframe

```
┌────────────── 375px viewport ──────────────────────────────────────┐
│  ┌───── Top bar ─────────────────────────────────────────────────┐ │
│  │  ☰  Noto        [ ⌘K Search ]               [ + ]           │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──── Notes in "Startup MVP" ──────────────────────────────────┐  │
│  │  [Search: ╭────────────────────────╮]                         │  │
│  │            ╰────────────────────────╯                         │  │
│  │  ▌  Project Kickoff Notes                                     │  │
│  │     Scope, timeline, design spri…    May 10 · #mvp           │  │
│  │  ─────────────────────────────────────────────────────────    │  │
│  │     Design System Draft                                       │  │
│  │     Color tokens, typography…        May 9 · #design         │  │
│  │  ─────────────────────────────────────────────────────────    │  │
│  │     Q1 OKRs                                                   │  │
│  │     Revenue: $10k MRR…                May 7                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───── Bottom Tab Bar ──────────────────────────────────────────┐ │
│  │  [Notes]   [Kanban]   [Tasks]   [Settings]                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Top bar height | `56px`, `--bg-primary` |
| Menu icon | `24px`, opens sidebar as bottom sheet |
| Bottom tab bar | `56px` fixed bottom, `--bg-secondary`, `--border-primary` top border, safe-area-inset |
| Tab item | Icon + 10px label, `--font-size-xs`, active: `--accent-primary` |
| Note card | Full width, 56px min-height |
| New note | `+` FAB or top-right button |

---

## 8. Mobile Editor (< 768px)

### ASCII Wireframe

```
┌────────────── 375px viewport ──────────────────────────────────────┐
│  ┌───── Top bar ─────────────────────────────────────────────────┐ │
│  │  ← Back   Design System Draft                  ··· [Delete]  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──── Editor area ─────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  # Design System Draft                                        │  │
│  │                                                               │  │
│  │  ## Color Tokens                                              │  │
│  │                                                               │  │
│  │  The primary accent color is `--accent-primary`.              │  │
│  │                                                               │  │
│  │  ...                                                          │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───── Floating Formatting Bar (above keyboard) ─────────────────┐ │
│  │  B   I   H1   H2   `code`   -list   1.list   Link   ···       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│  ────────────────── System keyboard ──────────────────────────────  │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Back button | `←` arrow icon + "Back" label, `--accent-primary` |
| Title in top bar | 1-line truncated, `--font-size-sm`, weight 600 |
| Overflow menu | `···` → bottom sheet: Move, Export, Delete |
| Floating formatting bar | `44px` tall, `--bg-secondary`, `--shadow-lg`, above keyboard (CSS env safe area) |
| Formatting bar pins to `bottom: env(keyboard-inset-height, 0)` | Dynamic viewport adjustment |
| Save status | Auto-saved; no explicit indicator on mobile (save on every keystroke) |

---

## 9. Empty States (3 Variants)

### 9A — Empty Notebook

```
┌──────────────── NotesList panel ────────────────────────┐
│                                                          │
│                  🔖                                      │
│           No notes yet                                   │
│    Create your first note in this notebook.             │
│                                                          │
│              [ + New Note ]                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 9B — Empty Search Results

```
┌──────────────── NotesList panel ────────────────────────┐
│                                                          │
│                  🔍                                      │
│              No results                                  │
│   Try different keywords or browse your notebooks.      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 9C — Fresh Install / Welcome

```
┌──────────── Full Editor pane ───────────────────────────┐
│                                                          │
│                   ✦                                      │
│             Welcome to Noto                              │
│   Start by creating a notebook or pressing ⌘K           │
│        to search and jump anywhere.                      │
│                                                          │
│         [ Create your first notebook ]                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Spec Table (all variants)

| Element | Token |
|---|---|
| Icon size | `48px` |
| Icon color | `--text-muted`, `opacity: 0.6` |
| Headline | `--font-size-lg`, weight 600, `--text-primary` |
| Body text | `--font-size-sm`, `--text-tertiary`, `max-width: 320px` centered |
| CTA | `btn btn-primary` |
| Container layout | `flex column center`, `min-height: 240px`, `padding: --space-4xl --space-xl` |

---

## 10. Error Screen (ErrorBoundary)

### ASCII Wireframe

```
┌─────────────────────────── Full viewport ──────────────────────────────────┐
│                                                                              │
│                                                                              │
│                            ⚠                                                │
│                     Something went wrong                                    │
│                                                                              │
│           We hit an unexpected error. Your notes are safe.                  │
│                                                                              │
│              [ Reload App ]        [ Copy Error Details ]                   │
│                                                                              │
│   ▸ Show technical details                                                   │
│   ╔════════════════════════════════════════════════════════════════╗        │
│   ║  TypeError: Cannot read properties of undefined (reading 'id')║        │
│   ║  at NotesList (NotesList.jsx:45)                               ║        │
│   ║  at App.jsx:120                                                ║        │
│   ╚════════════════════════════════════════════════════════════════╝        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Background | `var(--bg-primary)` full viewport |
| Icon | `⚠` or `AlertTriangle`, `48px`, `--color-warning` |
| Headline | `var(--font-size-xl)`, weight 700, `--text-primary` |
| Body | `var(--font-size-sm)`, `--text-secondary` |
| Reload button | `btn btn-primary` |
| Copy error button | `btn btn-secondary` |
| Stack trace | `<details>` + `<pre>`, `--font-mono`, `--font-size-xs`, `--bg-tertiary` bg |
| Implemented in | `src/components/ErrorBoundary.jsx` |

---

## 11. Onboarding Flow (3 Steps)

Shown only on first sign-in (triggered if `localStorage.noto-onboarded` is not set).

### Step 1 — Welcome

```
┌────────────── Onboarding modal (560px) ───────────────────────────┐
│                  ◈  Welcome to Noto!                               │
│                                                                    │
│   Noto organises your notes using the PARA system.                │
│   Let's take a quick tour.                                        │
│                         ●○○  (step 1 of 3)                        │
│                    [ Get Started → ]                               │
└────────────────────────────────────────────────────────────────────┘
```

### Step 2 — Create Your First Notebook

```
┌────────────── Onboarding modal ───────────────────────────────────┐
│                  📁 Your first notebook                            │
│                                                                    │
│   Give it a name and choose a PARA category.                      │
│                                                                    │
│   Name: ┌──────────────────────────────────────┐                  │
│          │ My Projects                          │                  │
│          └──────────────────────────────────────┘                  │
│                                                                    │
│   Category: ○ Projects  ○ Areas  ○ Resources  ● Inbox             │
│                        ●●○   [ Create Notebook → ]                 │
└────────────────────────────────────────────────────────────────────┘
```

### Step 3 — Quick Switcher Tip

```
┌────────────── Onboarding modal ───────────────────────────────────┐
│                  ⌘  Pro tip: Quick Switcher                        │
│                                                                    │
│   Press ⌘K (Ctrl+K on Windows) from anywhere to                  │
│   instantly jump to any note.                                     │
│                                                                    │
│                        ●●●   [ Done! Start writing ]              │
└────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Modal width | `560px` |
| Step indicator | Dots `●○○` — active: `--accent-primary`, inactive: `--bg-tertiary` |
| Primary CTA | `btn btn-primary`, full-width |
| Animation | Slide transition between steps: `translateX(-100%)` → `translateX(0)` |
| Skip | "Skip tour" link bottom-left, `--text-muted` |

---

## 12. Settings Panel

### ASCII Wireframe

```
┌──────────────── Settings modal (600px) ──────────────────────────────────┐
│  ╔════════════════════════════════════════════════════════════════════╗   │
│  ║  Settings                                                      ×  ║   │
│  ╠════════════════════════════════════════════════════════════════════╣   │
│  ║  ┌─ Sidebar ─────────────────────────────┐                        ║   │
│  ║  │  Account                              │                        ║   │
│  ║  │  Appearance                           │  [Content panel]       ║   │
│  ║  │  Editor                               │                        ║   │
│  ║  │  About                                │  Appearance            ║   │
│  ║  └───────────────────────────────────────┘  ─────────────────     ║   │
│  ║                                             Theme                 ║   │
│  ║                                             ● Dark                ║   │
│  ║                                             ○ Light               ║   │
│  ║                                             ○ Eyecare             ║   │
│  ║                                                                    ║   │
│  ║                                             Font size             ║   │
│  ║                                             [──●──────]  Base     ║   │
│  ╚════════════════════════════════════════════════════════════════════╝   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Spec Table

| Element | Value |
|---|---|
| Modal size | `600px` wide, `480px` tall |
| Left sidebar | `160px`, `--bg-secondary`, nav sections |
| Content panel | `flex: 1`, `padding: --space-xl` |
| Section items | `btn btn-ghost` full-width, left-align, active: `--bg-tertiary` |
| Section Appearance | Theme radio group (3 options) + font-size slider |
| Section Account | Avatar + display name + email + Sign Out button |
| Section Editor | Auto-save toggle (switch), spell-check toggle, font family select |
| Section About | Version, changelog link, GitHub link |

---

## Micro-Interactions Catalogue

| # | Interaction | Duration | Easing | Element |
|---|---|---|---|---|
| 1 | Note card hover | 120ms | `ease-out` | `.note-card` bg, border |
| 2 | Sidebar item hover | 120ms | `ease-out` | `.sidebar-item` bg |
| 3 | Sidebar active bar appear | 200ms | `ease-out` | `.sidebar-item::before` |
| 4 | Button press | 80ms | `ease-in` | `transform: scale(0.97)` |
| 5 | Modal open | 200ms | `ease-out` | opacity + `scale(0.96)` → `1` |
| 6 | Modal close | 150ms | `ease-in` | opacity fade |
| 7 | Quick Switcher open | 200ms | `ease-out` | fade + `translateY(-4px)` → 0 |
| 8 | Toast appear | 200ms | `ease-out` | slide from bottom |
| 9 | Toast disappear | 300ms | `ease-in` | slide out + fade |
| 10 | Kanban card pickup | 120ms | `ease-out` | `scale(1.02)`, `--shadow-lg` |
| 11 | Kanban card drop | 200ms | `cubic-bezier(0.34,1.56,0.64,1)` (spring) | `scale(1.02)` → `1` |
| 12 | Zen mode in | 300ms | `ease-out` | sidebar + panel collapse |
| 13 | Zen mode chrome fade | 2000ms idle | `ease-out` | UI chrome opacity → 0 |
| 14 | Save indicator appear | immediate | — | fade-in |
| 15 | Save indicator fade | 2000ms after "saved" | `ease-out` | opacity → 0 |
| 16 | Tag pill add | 200ms | `ease-out` | scale-in |
| 17 | Tag pill remove | 150ms | `ease-in` | scale-out + opacity → 0 |
| 18 | Theme switch | 200ms | `ease-out` | all `--bg-*`, `--text-*` transitions |

---

## Accessibility Specification

### WCAG 2.1 AA Compliance

| Criterion | Status | Implementation |
|---|---|---|
| 1.1.1 Non-text content | ✅ | All icons: `aria-hidden="true"` + `aria-label` on icon buttons |
| 1.3.1 Info and relationships | ✅ | Semantic HTML: `<nav>`, `<main>`, `<ul>`, `<button>` |
| 1.4.3 Contrast (minimum) | ✅ | All text pairs verified ≥ 4.5:1 |
| 1.4.4 Resize text | ✅ | All sizes in `rem` / `em` / CSS tokens |
| 1.4.10 Reflow | ✅ | Single-column at 320px viewport |
| 2.1.1 Keyboard | ✅ | All interactive elements focusable + operable |
| 2.4.3 Focus order | ✅ | Logical tab order: sidebar → notes → editor |
| 2.4.7 Focus visible | ✅ | `:focus-visible` ring on all focusable elements |
| 3.2.1 On focus | ✅ | No context changes on focus |
| 4.1.3 Status messages | ✅ | Save indicator: `role="status"` + `aria-live="polite"` |

### VoiceOver Heading Order

```
h1: App name (login screen only)
h2: Section headings (sidebar categories)
h3: Notebook names
```

Editor content headings (rendered Markdown) start at h1 logically within the note context.

### Keyboard Map (Full)

| Shortcut | Action |
|---|---|
| `⌘K` | Open Quick Switcher |
| `⌘N` | New note |
| `⌘S` | Force save |
| `⌘1` | Edit mode |
| `⌘2` | Preview mode |
| `⌘3` | Split mode |
| `⌘4` | Zen mode |
| `⌘F` | Focus search |
| `Esc` | Dismiss modal / Quick Switcher / cancel rename |
| `↑` / `↓` | Navigate note list |
| `Enter` | Open focused note |
| `Tab` | Move between sidebar → notes → editor |

---

## Responsive Behaviour Matrix

| Screen | Desktop (>1024px) | Tablet (768–1024px) | Mobile (<768px) |
|---|---|---|---|
| Login | Centred card, max 400px | Same | Card full-width, 16px margin |
| Home | Three columns | Sidebar drawer + two columns | Single panel navigation |
| Editor | 3-col shell | 2-col (NotesList + Editor) | Full screen editor |
| Zen Mode | Full screen | Full screen | Full screen, no chrome |
| Quick Switcher | Centred, max 560px | Same | Full-width bottom sheet |
| Kanban | Horizontal scroll | Horizontal scroll | One column, vertical |
| Tasks | Sidebar + full panel | Full panel | Full screen |
| Empty State | Inline in panel | Same | Same, centred |
| Error | Full page centred | Same | Same |
| Onboarding | Modal centred | Modal full-width | Bottom sheet |
| Settings | Two-pane modal | Same | Full screen sheet |
| Notes List | Fixed 300px | 100% drawer | Full screen |

---

## Designer's Notes

### On PARA and Colour
PARA colours are the only non-neutral colours in the sidebar. They do not compete — each category has its own hue family (violet, blue, green, grey, amber), creating an instant spatial memory. When you see purple, you know you're in Projects. This is intentional: the interface teaches through consistent colour association, not labels.

### On Zen Mode
The Zen mode is not a "distraction-free mode" in the traditional sense (removing toolbars). It is a **focus amplifier** — the UI stays available, but retreats until summoned. Moving the cursor brings back the exit button; the keyboard shortcuts still work. Smart chrome, not absent chrome.

### On the Quick Switcher
Users who write daily in Noto will rarely click in the sidebar. The Quick Switcher is the *primary* navigation for power users. For this reason, it has the highest z-index in the system (`z-spotlight: 500`), the most polished animation, and the tightest keyboard UX. It is the feature that earns repeated use.

### On Auto-Save
There is no "Save" button in Noto. This is a deliberate trust signal: the app handles persistence. The Save Indicator exists only to confirm that the save *happened* — not to create anxiety about whether the user remembered to save. The `saved` state fades after 2 seconds because it no longer needs to be visible: it has served its purpose.

### On Error States
The ErrorBoundary is dressed up enough to feel confident, not minimal to feel dismissive. It uses the app's full design language (not browser-default styles) to communicate: "We designed for this failure mode. Your data is safe." The Copy Error Detail button respects technical users without forcing everyone to see the stack trace.
