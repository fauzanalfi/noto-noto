// UUID generator
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Format date relative
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Format full date
export function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Extract plain text snippet from markdown
export function extractSnippet(markdown, maxLen = 120) {
  if (!markdown) return "";
  return markdown
    .replace(/#+\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[-*>]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .substring(0, maxLen);
}

// Debounce function
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Default PARA notebooks
export const DEFAULT_PARA_CATEGORIES = [
  { id: "projects", name: "Projects", color: "#ef6a6a", icon: "rocket" },
  { id: "areas", name: "Areas", color: "#efb86a", icon: "compass" },
  { id: "resources", name: "Resources", color: "#6aef8a", icon: "book-open" },
  { id: "archive", name: "Archive", color: "#8a8aa0", icon: "archive" },
];

// Sample welcome note in markdown
export const WELCOME_NOTE_CONTENT = `# Welcome to Noto! 📝

Noto is your **Second Brain** — a beautiful note-taking app organized using the **PARA method** by Tiago Forte.

## 🧠 What is PARA?

PARA stands for:

- **Projects** — Short-term efforts with a clear goal and deadline
- **Areas** — Long-term responsibilities you manage over time
- **Resources** — Topics and interests you want to reference later
- **Archive** — Inactive items from the other three categories

## ✍️ Markdown Support

Noto supports full Markdown syntax:

### Text Formatting
- **Bold text** with \`**double asterisks**\`
- *Italic text* with \`*single asterisks*\`
- ~~Strikethrough~~ with \`~~tildes~~\`

### Code
Inline \`code\` with backticks, or code blocks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Lists & Tasks
- [x] Create a note
- [x] Organize into PARA categories
- [ ] Add tags for easy search
- [ ] Build your Second Brain!

### Blockquotes
> "Your mind is for having ideas, not holding them." — David Allen

---

*Start by creating a new notebook or note using the sidebar. Happy note-taking!* 🚀
`;

// Count words in plain text extracted from markdown
export function countWords(markdown) {
  if (!markdown) return 0;
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~>|\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

// Export a single note as a .md file download
export function exportNoteAsMarkdown(note) {
  const content = note.title
    ? `# ${note.title}\n\n${note.content || ''}`
    : (note.content || '');
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(note.title || 'untitled').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export all notes as a JSON backup download
export function exportAllNotesAsJSON(notes) {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `noto-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
