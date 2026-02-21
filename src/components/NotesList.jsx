import { Search, Plus, SortDesc } from 'lucide-react';
import { formatDate, extractSnippet } from '../utils';
import { Pin } from 'lucide-react';

export default function NotesList({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
  title,
}) {
  return (
    <div className="notes-list-panel" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="notes-list-header">
        <h2>{title || 'All Notes'}</h2>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search */}
      <div className="search-box">
        <Search className="icon" size={16} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="notes-list-scroll">
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>No notes found</p>
            <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
              Create a new note to get started
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="note-card-title">
                {note.title || 'Untitled Note'}
              </div>
              <div className="note-card-snippet">
                {extractSnippet(note.content)}
              </div>
              <div className="note-card-meta">
                {note.pinned && <Pin size={12} className="pin-icon" />}
                <span>{formatDate(note.updatedAt)}</span>
              </div>
              {note.tags.length > 0 && (
                <div className="note-card-tags">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="tag">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* FAB: New Note */}
      <button className="new-note-btn" onClick={onCreateNote} title="New Note">
        <Plus size={22} />
      </button>
    </div>
  );
}
