import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Menu, ArrowLeft, Pin, Trash2, RotateCcw, BookOpen,
  Edit3, Eye, Columns, X, ChevronDown, Copy, Download,
  Maximize2, Minimize2,
} from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { useNotebooks } from './hooks/useNotebooks';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import Preview from './components/Preview';
import EmptyState from './components/EmptyState';
import QuickSwitcher from './components/QuickSwitcher';
import LoginScreen from './components/LoginScreen';
import { formatFullDate, exportNoteAsMarkdown, exportAllNotesAsJSON } from './utils';

export default function App() {
  // Data hooks
  const { user, signIn, signOut } = useAuth();
  const {
    notes, allTags, createNote, updateNote, deleteNote, restoreNote,
    permanentlyDeleteNote, togglePin, moveToNotebook, addTag, removeTag,
    getFilteredNotes, saving, emptyTrash, duplicateNote,
  } = useNotes(user?.uid);
  const { notebooks, createNotebook, renameNotebook, deleteNotebook, moveNotebookCategory } = useNotebooks(user?.uid);
  const { theme, setTheme } = useTheme();

  // UI state
  const [activeView, setActiveView] = useState('all'); // all | pinned | trash | notebook | tag
  const [activeNotebookId, setActiveNotebookId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('split'); // edit | preview | split
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false); // mobile: show editor
  const [tagInput, setTagInput] = useState('');
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [moveMenuPos, setMoveMenuPos] = useState({ top: 0, left: 0 });
  const moveMenuRef = useRef(null);
  const [zenMode, setZenMode] = useState(false);
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuPos, setExportMenuPos] = useState({ top: 0, left: 0 });
  const exportMenuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [saveStatus, setSaveStatus] = useState(null);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    const filters = { search: searchQuery };
    if (activeView === 'trash') filters.trashed = true;
    else if (activeView === 'pinned') filters.pinned = true;
    else if (activeView === 'notebook') filters.notebookId = activeNotebookId;
    else if (activeView === 'tag') filters.tag = activeTag;
    return getFilteredNotes(filters);
  }, [activeView, activeNotebookId, activeTag, searchQuery, getFilteredNotes]);

  // Active note
  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  // Note counts
  const noteCountByNotebook = useMemo(() => {
    const counts = {};
    notes.filter((n) => !n.trashed).forEach((n) => {
      counts[n.notebookId] = (counts[n.notebookId] || 0) + 1;
    });
    return counts;
  }, [notes]);

  const noteCountByTag = useMemo(() => {
    const counts = {};
    notes.filter((n) => !n.trashed).forEach((n) => {
      n.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    });
    return counts;
  }, [notes]);

  const totalNotes = notes.filter((n) => !n.trashed).length;
  const pinnedCount = notes.filter((n) => !n.trashed && n.pinned).length;
  const trashedCount = notes.filter((n) => n.trashed).length;

  // List panel title
  const listTitle = useMemo(() => {
    if (activeView === 'all') return 'All Notes';
    if (activeView === 'pinned') return 'Starred';
    if (activeView === 'trash') return 'Trash';
    if (activeView === 'tag') return `#${activeTag}`;
    if (activeView === 'notebook') {
      const nb = notebooks.find((n) => n.id === activeNotebookId);
      return nb ? nb.name : 'Notebook';
    }
    return 'Notes';
  }, [activeView, activeNotebookId, activeTag, notebooks]);

  // Create note in current context
  const handleCreateNote = useCallback(() => {
    const notebookId =
      activeView === 'notebook' && activeNotebookId
        ? activeNotebookId
        : 'resources';
    const note = createNote(notebookId);
    setActiveNoteId(note.id);
    setShowEditor(true);
  }, [activeView, activeNotebookId, createNote]);

  // Select note
  const handleSelectNote = useCallback((id) => {
    setActiveNoteId(id);
    setShowEditor(true);
  }, []);

  // Back to list (mobile)
  const handleBackToList = useCallback(() => {
    setShowEditor(false);
  }, []);

  // Tag add
  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && activeNote) {
      addTag(activeNote.id, tagInput.trim().toLowerCase().replace(/\s+/g, '-'));
      setTagInput('');
    }
  }, [tagInput, activeNote, addTag]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNote]);

  // Quick switcher (Ctrl/Cmd+K)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickSwitcher((v) => !v);
      }
      if (e.key === 'Escape') setShowQuickSwitcher(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Reactive isMobile
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save status indicator
  const isFirstSaveRender = useRef(true);
  useEffect(() => {
    if (isFirstSaveRender.current) { isFirstSaveRender.current = false; return; }
    if (saving) {
      setSaveStatus('saving');
    } else {
      setSaveStatus('saved');
      const t = setTimeout(() => setSaveStatus(null), 2000);
      return () => clearTimeout(t);
    }
  }, [saving]);

  // Get notebook name for active note
  const activeNoteNotebook = activeNote
    ? notebooks.find((nb) => nb.id === activeNote.notebookId)
    : null;

  const isMobile = windowWidth <= 768;

  // Force non-split view on mobile
  useEffect(() => {
    if (isMobile && viewMode === 'split') setViewMode('edit');
  }, [isMobile]);

  // Auth gate
  const [loginError, setLoginError] = useState(null);
  const handleSignIn = async () => {
    try { await signIn(); setLoginError(null); }
    catch (e) { setLoginError(e.message); }
  };

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
        Loading…
      </div>
    );
  }

  if (user === null) {
    return <LoginScreen onSignIn={handleSignIn} error={loginError} />;
  }

  return (
    <div className={`app${zenMode ? ' zen-mode' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        notebooks={notebooks}
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setSearchQuery(''); }}
        activeNotebookId={activeNotebookId}
        setActiveNotebookId={setActiveNotebookId}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        allTags={allTags}
        noteCountByNotebook={noteCountByNotebook}
        totalNotes={totalNotes}
        pinnedCount={pinnedCount}
        trashedCount={trashedCount}
        onCreateNotebook={createNotebook}
        onRenameNotebook={renameNotebook}
        onDeleteNotebook={deleteNotebook}
        onMoveNotebookCategory={moveNotebookCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        noteCountByTag={noteCountByTag}
        user={user}
        onSignOut={signOut}
      />

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        <div className="mobile-header">
          {showEditor ? (
            <button className="mobile-header-btn" onClick={handleBackToList}>
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button className="mobile-header-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
          )}
          <h1>{showEditor && activeNote ? (activeNote.title || 'Untitled') : listTitle}</h1>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Notes List */}
          <div className={`${showEditor ? 'notes-list-panel hidden' : ''}`} 
               style={showEditor ? { display: undefined } : {}}>
            <NotesList
              notes={filteredNotes}
              activeNoteId={activeNoteId}
              onSelectNote={handleSelectNote}
              onCreateNote={handleCreateNote}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              title={listTitle}
              isTrash={activeView === 'trash'}
              onEmptyTrash={emptyTrash}
            />
          </div>

          {/* Editor Panel */}
          {activeNote ? (
            <div className={`editor-panel ${!showEditor ? 'hidden' : ''}`}
                 style={!showEditor && isMobile ? { display: 'none' } : {}}>
              {/* Note Toolbar */}
              <div className="editor-toolbar">
                {/* Back button — mobile only */}
                {isMobile && (
                  <button
                    className="toolbar-btn mobile-back-btn"
                    onClick={handleBackToList}
                    title="Back to notes"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}

                {/* Notebook info */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="toolbar-btn"
                    ref={moveMenuRef}
                    onClick={() => {
                      if (!showMoveMenu && moveMenuRef.current) {
                        const rect = moveMenuRef.current.getBoundingClientRect();
                        setMoveMenuPos({ top: rect.bottom + 4, left: rect.left });
                      }
                      setShowMoveMenu(!showMoveMenu);
                    }}
                    title="Move to notebook"
                    style={{ gap: '4px', fontSize: 'var(--font-size-xs)', minWidth: 'auto', padding: '4px 8px' }}
                  >
                    <BookOpen size={14} />
                    <span>{activeNoteNotebook?.name || 'Notebook'}</span>
                    <ChevronDown size={12} />
                  </button>

                  {/* Move to notebook dropdown — fixed position to escape stacking contexts */}
                  {showMoveMenu && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowMoveMenu(false)} />
                      <div className="context-menu" style={{
                        position: 'fixed',
                        top: moveMenuPos.top,
                        left: moveMenuPos.left,
                        zIndex: 9999,
                      }}>
                        {notebooks.map((nb) => (
                          <button
                            key={nb.id}
                            className="context-menu-item"
                            onClick={() => {
                              moveToNotebook(activeNote.id, nb.id);
                              setShowMoveMenu(false);
                            }}
                          >
                            <span className="para-dot" style={{ background: nb.color, width: 8, height: 8, borderRadius: '50%' }} />
                            {nb.name}
                            {nb.id === activeNote.notebookId && ' ✓'}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <span className="toolbar-date" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                  {formatFullDate(activeNote.updatedAt)}
                </span>

                <div className="toolbar-spacer" />

                {/* Pin */}
                <button
                  className={`toolbar-btn ${activeNote.pinned ? 'active' : ''}`}
                  onClick={() => togglePin(activeNote.id)}
                  title={activeNote.pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin size={16} />
                </button>

                {/* Trash / Restore */}
                {activeNote.trashed ? (
                  <>
                    <button
                      className="toolbar-btn"
                      onClick={() => restoreNote(activeNote.id)}
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={() => {
                        permanentlyDeleteNote(activeNote.id);
                        setActiveNoteId(null);
                        setShowEditor(false);
                      }}
                      title="Delete permanently"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    className="toolbar-btn"
                    onClick={() => {
                      deleteNote(activeNote.id);
                      setActiveNoteId(null);
                      setShowEditor(false);
                    }}
                    title="Move to trash"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* Save indicator */}
                {saveStatus && (
                  <span className="save-indicator">
                    {saveStatus === 'saving' ? 'Saving…' : 'Saved ✓'}
                  </span>
                )}

                {/* Duplicate note */}
                <button
                  className="toolbar-btn"
                  onClick={() => {
                    const copy = duplicateNote(activeNote.id);
                    if (copy) setActiveNoteId(copy.id);
                  }}
                  title="Duplicate note"
                >
                  <Copy size={16} />
                </button>

                {/* Export */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="toolbar-btn"
                    ref={exportMenuRef}
                    onClick={() => {
                      if (!showExportMenu && exportMenuRef.current) {
                        const rect = exportMenuRef.current.getBoundingClientRect();
                        setExportMenuPos({ top: rect.bottom + 4, left: rect.left });
                      }
                      setShowExportMenu((v) => !v);
                    }}
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                  {showExportMenu && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setShowExportMenu(false)} />
                      <div className="context-menu" style={{ position: 'fixed', top: exportMenuPos.top, left: exportMenuPos.left, zIndex: 9999 }}>
                        <button className="context-menu-item" onClick={() => { exportNoteAsMarkdown(activeNote); setShowExportMenu(false); }}>
                          Export as Markdown
                        </button>
                        <button className="context-menu-item" onClick={() => { exportAllNotesAsJSON(notes); setShowExportMenu(false); }}>
                          Backup all (JSON)
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {!isMobile && (
                  <>
                    <div className="toolbar-divider" />
                    <button
                      className={`toolbar-btn ${zenMode ? 'active' : ''}`}
                      onClick={() => setZenMode((v) => !v)}
                      title={zenMode ? 'Exit zen mode' : 'Zen mode'}
                    >
                      {zenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </>
                )}

                <div className="toolbar-divider" />

                {/* View mode toggle */}
                <div className="view-mode-toggle">
                  <button
                    className={`view-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
                    onClick={() => setViewMode('edit')}
                    title="Edit only"
                  >
                    <Edit3 className="icon" size={14} />
                  </button>
                  {!isMobile && (
                    <button
                      className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
                      onClick={() => setViewMode('split')}
                      title="Split view"
                    >
                      <Columns className="icon" size={14} />
                    </button>
                  )}
                  <button
                    className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                    onClick={() => setViewMode('preview')}
                    title="Preview only"
                  >
                    <Eye className="icon" size={14} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <input
                className="editor-title-input"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                placeholder="Note title..."
              />

              {/* Tags */}
              <div className="editor-tags-area">
                {activeNote.tags.map((tag) => (
                  <span key={tag} className="editor-tag">
                    #{tag}
                    <button onClick={() => removeTag(activeNote.id, tag)}>×</button>
                  </span>
                ))}
                <input
                  className="tag-add-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag();
                  }}
                  placeholder="+ tag"
                />
              </div>

              {/* Editor Content */}
              <div className="editor-content">
                {(viewMode === 'edit' || viewMode === 'split') && (
                  <Editor note={activeNote} onUpdateNote={updateNote} />
                )}
                {viewMode === 'split' && <div className="split-divider" />}
                {(viewMode === 'preview' || viewMode === 'split') && (
                  <Preview content={activeNote.content} />
                )}
              </div>
            </div>
          ) : (
            <EmptyState type={filteredNotes.length === 0 ? 'no-notes' : 'no-selection'} />
          )}
        </div>
      </div>

      {/* Quick Switcher */}
      {showQuickSwitcher && (
        <QuickSwitcher
          notes={notes}
          onSelect={(id) => {
            setActiveNoteId(id);
            setShowQuickSwitcher(false);
            setShowEditor(true);
          }}
          onClose={() => setShowQuickSwitcher(false)}
        />
      )}
    </div>
  );
}
