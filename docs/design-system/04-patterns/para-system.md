# PARA System Patterns

> **Role:** Apple Principal Designer  
> **Version:** 1.0 — March 2026

---

## 1. Overview

PARA (Projects, Areas, Resources, Archive) is the organisational backbone of Noto. Every notebook belongs to exactly one PARA category, and the entire app's information architecture mirrors this taxonomy. This document defines the design language, visual grammar, and interaction rules for the PARA system.

---

## 2. PARA Category Reference

| Category | Purpose | Icon (Lucide) | Color token | Default value (dark) |
|---|---|---|---|---|
| **Projects** | Active, goal-oriented work with a deadline | `FolderKanban` | `--para-projects` | `#c084fc` |
| **Areas** | Ongoing responsibilities without an end date | `Layers` | `--para-areas` | `#60a5fa` |
| **Resources** | Reference material + topics of interest | `BookOpen` | `--para-resources` | `#34d399` |
| **Archive** | Completed or inactive items | `Archive` | `--para-archive` | `#94a3b8` |
| **Inbox** | Uncategorised capture bucket | `Inbox` | `--para-inbox` | `#f59e0b` |

---

## 3. Visual Grammar

### 3.1 PARA Color Dots

Every notebook is represented by an 8px colored dot derived from its PARA category. This creates an immediate color vocabulary: purple = Projects, blue = Areas, green = Resources, grey = Archive, amber = Inbox.

### 3.2 Sidebar Grouping

Notebooks are grouped under their PARA category headers. The headers are styled as uppercase, small, muted section labels (`.sidebar-section-header`). The group can be collapsed to show only the category header.

### 3.3 Note Card Connection

Note cards do not show a PARA dot by default. When browsing "All Notes" or search results that span multiple notebooks, a faint notebook badge is shown on the note card linking back to the parent PARA category.

---

## 4. Inbox as Default Capture

The Inbox is always visible at the top of the sidebar, above the PARA groups. New notes are created in the currently selected notebook; if no notebook is selected, they land in Inbox.

Inbox is a special notebook: it cannot be deleted or moved to another PARA category.

---

## 5. Moving Notes Between Notebooks

The "Move to Notebook" action is reachable via:
1. Note card context menu → "Move to…"
2. Note Toolbar → `⋯` overflow menu

The `MoveToNotebookMenu` shows all notebooks grouped by PARA category, with their color dots. On selection, the note is moved via `useNoteActions.moveNote()`.

---

## 6. Kanban and PARA

The KanbanBoard view maps columns to note status, not PARA categories. PARA categories are a filing system; Kanban is a workflow view. The KanbanBoard only displays notes from the currently selected notebook.

---

## 7. Archive Behaviour

When a notebook is archived, it moves from its current PARA group to the Archive group. Notes inside it are unchanged. The notebook dot turns to the archive grey (`--para-archive`).

---

## 8. Design Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Keep PARA dots consistent: same color per category across all views | Use PARA colors for anything other than PARA category identification |
| Show the PARA category icon + label in section headers | Nest PARA categories (they are flat by design) |
| Default new notebooks to Inbox until the user categorises them | Create notebooks without a PARA category |
| Animate the dot color smoothly when a notebook changes category | Flash or blink PARA dots as a status indicator |
