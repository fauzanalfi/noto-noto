import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Menu, ArrowLeft, FileText, LayoutGrid, CheckSquare, Settings as SettingsIcon } from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { useNotebooks } from './hooks/useNotebooks';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useDebounce } from './hooks/useDebounce';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import Preview from './components/Preview';
import EmptyState from './components/EmptyState';
import QuickSwitcher from './components/QuickSwitcher';
import LoginScreen from './components/LoginScreen';
import NoteToolbar from './components/NoteToolbar';
import TagManager from './components/TagManager';
import TasksView from './components/TasksView';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import {
  exportNoteAsMarkdown,
  exportAllNotesAsMarkdownZip,
  exportCurrentListAsMarkdownZip,
} from './utils';

export default function App() {
  const { user, signIn, signOut } = useAuth();
  const {
    notes, allTags, createNote, updateNote, deleteNote, restoreNote,
    permanentlyDeleteNote, togglePin, moveToNotebook, addTag, removeTag,
    getFilteredNotes, saving, emptyTrash, duplicateNote, error: notesError,
  } = useNotes(user?.uid);
  const {
    notebooks,
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
  } = useNotebooks(user?.uid);
  const { theme, setTheme } = useTheme();

  const [activeView, setActiveView] = useState('all');
  const [activeNotebookId, setActiveNotebookId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('split-horizontal');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [saveStatus, setSaveStatus] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredNotes = useMemo(() => {
    const filters = { search: debouncedSearchQuery };
    if (activeView === 'trash') filters.trashed = true;
    else if (activeView === 'pinned') filters.pinned = true;
    else if (activeView === 'tasks') return notes.filter((n) => !n.trashed);
    else if (activeView === 'notebook') filters.notebookId = activeNotebookId;
    else if (activeView === 'tag') filters.tag = activeTag;
    return getFilteredNotes(filters);
  }, [activeView, activeNotebookId, activeTag, debouncedSearchQuery, getFilteredNotes, notes]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  const noteCountByNotebook = useMemo(() => {
    const counts = {};
    notes.filter((n) => !n.trashed).forEach((n) => {
      counts[n.notebookId] = (counts[n.notebookId] || 0) + 1;
    });
    return counts;
  }, [notes]);

  const { totalNotes, pinnedCount, trashedCount, tasksCount } = useMemo(() => {
    let tasks = 0;
    notes.filter((n) => !n.trashed && n.content).forEach((n) => {
      const matches = n.content.match(/^(\s*)-\s+\[ \]\s+.+/gm);
      if (matches) tasks += matches.length;
    });
    return {
      totalNotes: notes.filter((n) => !n.trashed).length,
      pinnedCount: notes.filter((n) => !n.trashed && n.pinned).length,
      trashedCount: notes.filter((n) => n.trashed).length,
      tasksCount: tasks,
    };
  }, [notes]);

  const listTitle = useMemo(() => {
    if (activeView === 'all') return 'All Notes';
    if (activeView === 'pinned') return 'Starred';
    if (activeView === 'trash') return 'Trash';
    if (activeView === 'tasks') return 'Tasks';
    if (activeView === 'kanban') return 'Kanban Board';
    if (activeView === 'tag') return `#${activeTag}`;
    if (activeView === 'notebook') {
      const nb = notebooks.find((n) => n.id === activeNotebookId);
      return nb ? nb.name : 'Notebook';
    }
    return 'Notes';
  }, [activeView, activeNotebookId, activeTag, notebooks]);

  const handleCreateNote = useCallback(() => {
    const notebookId =
      activeView === 'notebook' && activeNotebookId
        ? activeNotebookId
        : 'resources';
    const note = createNote(notebookId);
    if (!note) return;
    setActiveNoteId(note.id);
    setShowEditor(true);
  }, [activeView, activeNotebookId, createNote]);

  const handleSelectNote = useCallback((id) => {
    setActiveNoteId(id);
    setShowEditor(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowEditor(false);
  }, []);

  const handleAddTag = useCallback((tag) => {
    if (activeNote) {
      addTag(activeNote.id, tag);
    }
  }, [activeNote, addTag]);

  const handleRemoveTag = useCallback((tag) => {
    if (activeNote) {
      removeTag(activeNote.id, tag);
    }
  }, [activeNote, removeTag]);

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

  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey;

      // Quick Switcher
      if (mod && e.key === 'k') {
        e.preventDefault();
        setShowQuickSwitcher((v) => !v);
        return;
      }

      // Force save (⌘S)
      if (mod && e.key === 's') {
        e.preventDefault();
        // Save is automatic; just flash the indicator
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 1500);
        return;
      }

      // Focus search (⌘F / Ctrl+F) — dispatch a custom event the NotesList can listen to
      if (mod && e.key === 'f') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('noto:focus-search'));
        return;
      }

      // View mode shortcuts (⌘1-4) — only when not in modal/input
      const tag = document.activeElement?.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
      if (mod && !inInput) {
        if (e.key === '1') { e.preventDefault(); setViewMode('edit'); }
        if (e.key === '2') { e.preventDefault(); setViewMode('preview'); }
        if (e.key === '3') { e.preventDefault(); setViewMode('split-horizontal'); }
        if (e.key === '4') { e.preventDefault(); setZenMode((v) => !v); }
      }

      // Escape
      if (e.key === 'Escape') {
        if (showQuickSwitcher) { setShowQuickSwitcher(false); return; }
        if (showSettings)      { setShowSettings(false);      return; }
        if (showOnboarding)    return; // don't dismiss onboarding with Esc
        if (zenMode)           { setZenMode(false);           return; }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showQuickSwitcher, showSettings, showOnboarding, zenMode]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger onboarding for first-time users
  useEffect(() => {
    if (user && !localStorage.getItem('noto-onboarded')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const prevSavingRef = useRef(saving);
  useEffect(() => {
    let statusTimer;

    if (prevSavingRef.current !== saving) {
      prevSavingRef.current = saving;
      if (saving) {
        statusTimer = setTimeout(() => setSaveStatus('saving'), 0);
      } else if (notesError) {
        statusTimer = setTimeout(() => setSaveStatus('error'), 0);
      } else {
        statusTimer = setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(null), 2000);
        }, 0);
      }
    }

    return () => {
      if (statusTimer) clearTimeout(statusTimer);
    };
  }, [saving, notesError]);

  const activeNoteNotebook = activeNote
    ? notebooks.find((nb) => nb.id === activeNote.notebookId)
    : null;

  const isMobile = windowWidth <= 768;
  const normalizedViewMode =
    viewMode === 'split'
      ? 'split-horizontal'
      : ['edit', 'split-horizontal', 'split-vertical', 'preview'].includes(viewMode)
      ? viewMode
      : 'edit';
  const effectiveViewMode = normalizedViewMode;
  const showEditorPane = effectiveViewMode === 'edit' || effectiveViewMode === 'split-horizontal' || effectiveViewMode === 'split-vertical';
  const showPreviewPane = effectiveViewMode === 'preview' || effectiveViewMode === 'split-horizontal' || effectiveViewMode === 'split-vertical';
  const splitOrientation = effectiveViewMode === 'split-vertical' ? 'vertical' : 'horizontal';

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e) {
      console.error('Sign in error:', e);
    }
  };

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
        Loading…
      </div>
    );
  }

  if (user === null) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return (
    <div className={`app${zenMode ? ' zen-mode' : ''}`}>
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
        tasksCount={tasksCount}
        onCreateNotebook={createNotebook}
        onRenameNotebook={renameNotebook}
        onDeleteNotebook={deleteNotebook}
        onMoveNotebookCategory={moveNotebookCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        user={user}
        onSignOut={signOut}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div
        className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
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

        <div className={`workspace-panels ${activeView === 'kanban' ? 'kanban-panels' : ''}`}>
          {activeView === 'tasks' ? (
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-xl)' }}>
              <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>Tasks</h2>
              <TasksView
                notes={notes}
                onUpdateNote={updateNote}
                onSelectNote={(id) => { handleSelectNote(id); setActiveView('all'); }}
              />
            </div>
          ) : (
          <>
          <NotesList
            className={showEditor ? 'hidden' : ''}
            notes={filteredNotes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onUpdateNote={updateNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            title={listTitle}
            forcedBoardView={activeView === 'kanban'}
            isTrash={activeView === 'trash'}
            onEmptyTrash={emptyTrash}
          />

          {activeNote ? (
            <div className={`editor-panel ${!showEditor ? 'hidden' : ''}`}
                 style={!showEditor && isMobile ? { display: 'none' } : {}}>
              <NoteToolbar
                activeNote={activeNote}
                activeNoteNotebook={activeNoteNotebook}
                notebooks={notebooks}
                moveToNotebook={moveToNotebook}
                togglePin={togglePin}
                deleteNote={deleteNote}
                restoreNote={restoreNote}
                permanentlyDeleteNote={permanentlyDeleteNote}
                duplicateNote={duplicateNote}
                saveStatus={saveStatus}
                notesError={notesError}
                notes={notes}
                filteredNotes={filteredNotes}
                listTitle={listTitle}
                exportNoteAsMarkdown={exportNoteAsMarkdown}
                exportAllNotesAsMarkdownZip={exportAllNotesAsMarkdownZip}
                exportCurrentListAsMarkdownZip={exportCurrentListAsMarkdownZip}
                isMobile={isMobile}
                zenMode={zenMode}
                onToggleZenMode={setZenMode}
                viewMode={effectiveViewMode}
                onViewModeChange={setViewMode}
                onBackToList={handleBackToList}
              />

              <input
                className="editor-title-input"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                placeholder="Note title..."
              />

              <TagManager
                tags={activeNote.tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />

              <div className={`editor-content ${effectiveViewMode}`}>
                {showEditorPane && (
                  <Editor note={activeNote} onUpdateNote={updateNote} notes={notes} onNavigateNote={handleSelectNote} />
                )}
                {(effectiveViewMode === 'split-horizontal' || effectiveViewMode === 'split-vertical') && (
                  <div className={`split-divider ${splitOrientation}`} />
                )}
                {showPreviewPane && (
                  <Preview content={activeNote.content} notes={notes} onNavigateNote={handleSelectNote} />
                )}
              </div>
            </div>
          ) : (
            <EmptyState type={filteredNotes.length === 0 ? 'no-notes' : 'no-selection'} />
          )}
          </>
          )}
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tab-bar" role="tablist" aria-label="Main navigation">
        <button
          className={`mobile-tab-item ${['all','pinned','tag','notebook'].includes(activeView) ? 'active' : ''}`}
          onClick={() => { setActiveView('all'); setSearchQuery(''); }}
          role="tab"
          aria-selected={['all','pinned','tag','notebook'].includes(activeView)}
          aria-label="Notes"
        >
          <FileText size={22} aria-hidden="true" />
          <span>Notes</span>
        </button>
        <button
          className={`mobile-tab-item ${activeView === 'kanban' ? 'active' : ''}`}
          onClick={() => { setActiveView('kanban'); setSearchQuery(''); }}
          role="tab"
          aria-selected={activeView === 'kanban'}
          aria-label="Kanban"
        >
          <LayoutGrid size={22} aria-hidden="true" />
          <span>Kanban</span>
        </button>
        <button
          className={`mobile-tab-item ${activeView === 'tasks' ? 'active' : ''}`}
          onClick={() => { setActiveView('tasks'); setSearchQuery(''); }}
          role="tab"
          aria-selected={activeView === 'tasks'}
          aria-label="Tasks"
        >
          <CheckSquare size={22} aria-hidden="true" />
          <span>Tasks</span>
        </button>
        <button
          className="mobile-tab-item"
          onClick={() => setShowSettings(true)}
          role="tab"
          aria-label="Settings"
        >
          <SettingsIcon size={22} aria-hidden="true" />
          <span>Settings</span>
        </button>
      </nav>

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

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          theme={theme}
          onThemeChange={setTheme}
          user={user}
          onSignOut={signOut}
        />
      )}

      {showOnboarding && (
        <Onboarding
          onComplete={() => setShowOnboarding(false)}
          onCreateNotebook={createNotebook}
        />
      )}
    </div>
  );
}
