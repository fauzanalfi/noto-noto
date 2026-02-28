import { useState, useMemo } from 'react';
import { Search, Plus, Pin, ArrowUpDown, Trash2, List, LayoutGrid } from 'lucide-react';
import { formatDate, extractSnippet } from '../utils';
import KanbanBoard from './KanbanBoard';

const SORT_OPTIONS = [
  { id: 'updated', label: 'Last modified' },
  { id: 'created', label: 'Date created' },
  { id: 'az', label: 'Title A–Z' },
];

export default function NotesList({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onUpdateNote,
  searchQuery,
  onSearchChange,
  title,
  isTrash,
  onEmptyTrash,
}) {
  const [sortBy, setSortBy] = useState('updated');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [boardView, setBoardView] = useState(false);

  const sortedNotes = useMemo(() => {
    const arr = [...notes];
    if (sortBy === 'created') arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'az') arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return arr;
  }, [notes, sortBy]);

  return (
    <div className="notes-list-panel" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="notes-list-header">
        <h2>{title || 'All Notes'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </span>
          {/* Board / List toggle */}
          {!isTrash && (
            <button
              className="toolbar-btn"
              style={{ minWidth: 'auto', height: '26px', padding: '2px 6px' }}
              onClick={() => setBoardView((v) => !v)}
              title={boardView ? 'List view' : 'Board view'}
              aria-label={boardView ? 'Switch to list view' : 'Switch to board view'}
            >
              {boardView ? <List size={12} /> : <LayoutGrid size={12} />}
            </button>
          )}
          {/* Sort button */}
          <div style={{ position: 'relative' }}>
            <button
              className="toolbar-btn"
              style={{ minWidth: 'auto', height: '26px', padding: '2px 6px' }}
              onClick={() => setShowSortMenu((v) => !v)}
              title={`Sort: ${SORT_OPTIONS.find((o) => o.id === sortBy)?.label}`}
              aria-label={`Sort by ${SORT_OPTIONS.find((o) => o.id === sortBy)?.label}`}
              aria-expanded={showSortMenu}
              aria-haspopup="menu"
            >
              <ArrowUpDown size={12} />
            </button>
            {showSortMenu && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowSortMenu(false)} />
                <div className="context-menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 9999 }}>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      className={`context-menu-item ${sortBy === opt.id ? 'active' : ''}`}
                      onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                    >
                      {opt.label}{sortBy === opt.id ? ' ✓' : ''}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Empty Trash action */}
      {isTrash && notes.length > 0 && (
        <div style={{ padding: '0 var(--space-md) var(--space-sm)' }}>
          <button
            onClick={onEmptyTrash}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              width: '100%', padding: '6px 10px', border: '1px solid #ef4444',
              borderRadius: 'var(--radius-sm)', background: 'transparent',
              color: '#ef4444', cursor: 'pointer', fontSize: 'var(--font-size-xs)',
              fontFamily: 'var(--font-sans)', fontWeight: 500,
            }}
          >
            <Trash2 size={13} /> Empty Trash ({notes.length})
          </button>
        </div>
      )}

      {/* Search */}
      <div className="search-box">
        <Search className="icon" size={16} aria-hidden="true" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      {/* Notes — list or board */}
      {boardView && !isTrash ? (
        <KanbanBoard
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={onSelectNote}
          onCreateNote={onCreateNote}
          onUpdateNote={onUpdateNote}
        />
      ) : (
      <div className="notes-list-scroll">
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>No notes found</p>
            <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
              Create a new note to get started
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`note-card ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectNote(note.id);
                }
              }}
              aria-label={`Note: ${note.title || 'Untitled Note'}`}
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
      )}

      {/* FAB: New Note */}
      <button className="new-note-btn" onClick={onCreateNote} title="New Note" aria-label="Create new note">
        <Plus size={22} />
      </button>
    </div>
  );
}
