import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { formatDate, extractSnippet } from '../utils';

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'var(--text-tertiary)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--accent-secondary)' },
  { id: 'done', label: 'Done', color: 'var(--para-resources)' },
];

export default function KanbanBoard({ notes, activeNoteId, onSelectNote, onCreateNote, onUpdateNote }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const getNoteStatus = (note) => note.status || 'backlog';

  const notesByCol = COLUMNS.reduce((acc, col) => {
    acc[col.id] = notes
      .filter((n) => !n.trashed && getNoteStatus(n) === col.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return acc;
  }, {});

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colId);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (draggedId) {
      onUpdateNote(draggedId, { status: colId });
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className={`kanban-col${dragOverCol === col.id ? ' kanban-col-dragover' : ''}`}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="kanban-col-header">
            <span className="kanban-col-dot" style={{ background: col.color }} />
            <span className="kanban-col-title">{col.label}</span>
            <span className="kanban-col-count">{notesByCol[col.id].length}</span>
            <button
              className="kanban-col-menu-btn"
              type="button"
              title={`${col.label} options`}
              aria-label={`${col.label} options`}
            >
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="kanban-cards">
            {notesByCol[col.id].map((note) => (
              <div
                key={note.id}
                className={`kanban-card${note.id === activeNoteId ? ' active' : ''}${draggedId === note.id ? ' dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectNote(note.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectNote(note.id)}
              >
                <div className="kanban-card-title">{note.title || 'Untitled'}</div>
                <div className="kanban-card-snippet">{extractSnippet(note.content)}</div>
                {note.tags?.length > 0 && (
                  <div className="kanban-card-tags">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="kanban-tag">#{tag}</span>
                    ))}
                  </div>
                )}
                <div className="kanban-card-date">{formatDate(note.updatedAt)}</div>
              </div>
            ))}

            <button
              className="kanban-add-task-card"
              onClick={onCreateNote}
              title={`Add task in ${col.label}`}
              aria-label={`Add task in ${col.label}`}
              type="button"
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
