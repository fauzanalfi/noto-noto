import { useMemo } from 'react';
import { CheckSquare, ExternalLink } from 'lucide-react';

const TASK_RE = /^(\s*)-\s+\[([ xX])\]\s+(.+)$/;

function extractTasks(notes) {
  const tasks = [];
  notes
    .filter((n) => !n.trashed && n.content)
    .forEach((note) => {
      const lines = note.content.split('\n');
      lines.forEach((line, lineIdx) => {
        const m = TASK_RE.exec(line);
        if (!m) return;
        const done = m[2].toLowerCase() === 'x';
        const text = m[3];
        tasks.push({ noteId: note.id, noteTitle: note.title || 'Untitled', lineIdx, text, done });
      });
    });
  return tasks;
}

function toggleTaskInContent(content, lineIdx) {
  const lines = content.split('\n');
  const line = lines[lineIdx];
  if (!line) return content;
  lines[lineIdx] = line.replace(/\[([ xX])\]/, (_, c) => (c === ' ' ? '[x]' : '[ ]'));
  return lines.join('\n');
}

export default function TasksView({ notes, onUpdateNote, onSelectNote }) {
  const tasks = useMemo(() => extractTasks(notes), [notes]);

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  const handleToggle = (task) => {
    const note = notes.find((n) => n.id === task.noteId);
    if (!note) return;
    const newContent = toggleTaskInContent(note.content, task.lineIdx);
    onUpdateNote(task.noteId, { content: newContent });
  };

  if (tasks.length === 0) {
    return (
      <div className="tasks-empty">
        <CheckSquare size={36} className="tasks-empty-icon" />
        <p>No tasks yet.</p>
        <p className="tasks-empty-hint">Add tasks in any note using<br /><code>- [ ] task text</code></p>
      </div>
    );
  }

  return (
    <div className="tasks-view">
      <div className="tasks-section">
        <div className="tasks-section-header">
          <span>To Do</span>
          <span className="tasks-count">{pending.length}</span>
        </div>
        {pending.map((task, i) => (
          <TaskItem key={i} task={task} onToggle={handleToggle} onSelectNote={onSelectNote} />
        ))}
        {pending.length === 0 && <div className="tasks-none">All done! 🎉</div>}
      </div>

      {done.length > 0 && (
        <div className="tasks-section tasks-section-done">
          <div className="tasks-section-header">
            <span>Completed</span>
            <span className="tasks-count">{done.length}</span>
          </div>
          {done.map((task, i) => (
            <TaskItem key={i} task={task} onToggle={handleToggle} onSelectNote={onSelectNote} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onSelectNote }) {
  return (
    <div className={`task-item${task.done ? ' task-done' : ''}`}>
      <button
        className="task-checkbox"
        onClick={() => onToggle(task)}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
        title={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.done ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="14" rx="3" fill="var(--accent-primary)" />
            <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="var(--border-default)" />
          </svg>
        )}
      </button>
      <span className="task-text">{task.text}</span>
      <button
        className="task-source-btn"
        onClick={() => onSelectNote(task.noteId)}
        title={`Open: ${task.noteTitle}`}
        aria-label={`Open note: ${task.noteTitle}`}
      >
        <ExternalLink size={11} />
        <span>{task.noteTitle}</span>
      </button>
    </div>
  );
}
