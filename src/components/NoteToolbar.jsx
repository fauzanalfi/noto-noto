import { useState, useRef, useCallback } from 'react';
import {
  BookOpen, Trash2, RotateCcw, Copy, ArrowLeft,
  ChevronDown, Pin, Maximize2, Minimize2,
  Edit3, Eye, Columns, Rows3, X,
} from 'lucide-react';
import { formatFullDate } from '../utils';
import MoveToNotebookMenu from './MoveToNotebookMenu';
import ExportMenu from './ExportMenu';

export default function NoteToolbar({
  activeNote,
  activeNoteNotebook,
  notebooks,
  moveToNotebook,
  togglePin,
  deleteNote,
  restoreNote,
  permanentlyDeleteNote,
  duplicateNote,
  saveStatus,
  notesError,
  notes,
  filteredNotes,
  listTitle,
  exportNoteAsMarkdown,
  exportAllNotesAsMarkdownZip,
  exportCurrentListAsMarkdownZip,
  isMobile,
  zenMode,
  onToggleZenMode,
  viewMode,
  onViewModeChange,
  onBackToList,
}) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [moveMenuPos, setMoveMenuPos] = useState({ top: 0, left: 0 });
  const moveMenuRef = useRef(null);

  const handleOpenMoveMenu = useCallback(() => {
    if (!showMoveMenu && moveMenuRef.current) {
      const rect = moveMenuRef.current.getBoundingClientRect();
      setMoveMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setShowMoveMenu(!showMoveMenu);
  }, [showMoveMenu]);

  if (!activeNote) return null;

  return (
    <>
      <div className="editor-toolbar">
        {isMobile && (
          <button
            className="toolbar-btn mobile-back-btn"
            onClick={onBackToList}
            title="Back to notes"
            aria-label="Back to notes list"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div style={{ position: 'relative' }}>
          <button
            className="toolbar-btn"
            ref={moveMenuRef}
            onClick={handleOpenMoveMenu}
            title="Move to notebook"
            style={{ gap: '4px', fontSize: 'var(--font-size-xs)', minWidth: 'auto', padding: '4px 8px' }}
          >
            <BookOpen size={14} />
            <span>{activeNoteNotebook?.name || 'Notebook'}</span>
            <ChevronDown size={12} />
          </button>

          <MoveToNotebookMenu
            show={showMoveMenu}
            position={moveMenuPos}
            notebooks={notebooks}
            currentNotebookId={activeNote.notebookId}
            onMove={(notebookId) => {
              moveToNotebook(activeNote.id, notebookId);
              setShowMoveMenu(false);
            }}
            onClose={() => setShowMoveMenu(false)}
          />
        </div>

        <span className="toolbar-date" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
          {formatFullDate(activeNote.updatedAt)}
        </span>

        <div className="toolbar-spacer" />

        <button
          className={`toolbar-btn ${activeNote.pinned ? 'active' : ''}`}
          onClick={() => togglePin(activeNote.id)}
          title={activeNote.pinned ? 'Unpin' : 'Pin'}
          aria-label={activeNote.pinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={16} aria-hidden="true" />
        </button>

        {activeNote.trashed ? (
          <>
            <button
              className="toolbar-btn"
              onClick={() => restoreNote(activeNote.id)}
              title="Restore"
              aria-label="Restore note from trash"
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
            <button
              className="toolbar-btn"
              onClick={() => {
                permanentlyDeleteNote(activeNote.id);
              }}
              title="Delete permanently"
              aria-label="Delete note permanently"
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </>
        ) : (
          <button
            className="toolbar-btn"
            onClick={() => deleteNote(activeNote.id)}
            title="Move to trash"
            aria-label="Move note to trash"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}

        {saveStatus && (
          <span className="save-indicator">
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Save failed' : 'Saved ✓'}
          </span>
        )}

        <button
          className="toolbar-btn"
          onClick={() => {
            const copy = duplicateNote(activeNote.id);
            if (copy) {
              // Parent will handle activeNoteId update via callback
            }
          }}
          title="Duplicate note"
          aria-label="Duplicate note"
        >
          <Copy size={16} aria-hidden="true" />
        </button>

        <ExportMenu
          note={activeNote}
          notes={notes}
          filteredNotes={filteredNotes}
          listTitle={listTitle}
          onExportNote={exportNoteAsMarkdown}
          onExportAllMarkdown={exportAllNotesAsMarkdownZip}
          onExportCurrentMarkdown={exportCurrentListAsMarkdownZip}
        />

        {!isMobile && (
          <>
            <div className="toolbar-divider" />
            <button
              className={`toolbar-btn ${zenMode ? 'active' : ''}`}
              onClick={() => onToggleZenMode((v) => !v)}
              title={zenMode ? 'Exit zen mode' : 'Zen mode'}
            >
              {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </>
        )}

        <div className="toolbar-divider" />

        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => onViewModeChange('edit')}
            title="Edit only"
          >
            <Edit3 className="icon" size={14} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'split-horizontal' ? 'active' : ''}`}
            onClick={() => onViewModeChange('split-horizontal')}
            title="Split horizontal (left/right)"
          >
            <Columns className="icon" size={14} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'split-vertical' ? 'active' : ''}`}
            onClick={() => onViewModeChange('split-vertical')}
            title="Split vertical (top/bottom)"
          >
            <Rows3 className="icon" size={14} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => onViewModeChange('preview')}
            title="Preview only"
          >
            <Eye className="icon" size={14} />
          </button>
        </div>
      </div>

      {notesError && (
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          borderRadius: '10px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontSize: 'var(--font-size-xs)' }}>{notesError}</span>
          <button className="toolbar-btn" title="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
