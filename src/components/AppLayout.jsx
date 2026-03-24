import {
  Menu,
  ArrowLeft,
  FileText,
  LayoutGrid,
  CheckSquare,
  Search,
  Command,
  Bell,
  Settings as SettingsIcon,
  BookMarked,
} from 'lucide-react';
import { useNotesContext } from '../context/NotesContext';
import { useUIContext } from '../context/UIContext';
import Sidebar from './Sidebar';
import NotesList from './NotesList';
import Editor from './Editor';
import Preview from './Preview';
import EmptyState from './EmptyState';
import QuickSwitcher from './QuickSwitcher';
import LoginScreen from './LoginScreen';
import NoteToolbar from './NoteToolbar';
import TagManager from './TagManager';
import TasksView from './TasksView';
import Onboarding from './Onboarding';
import Settings from './Settings';
import ReferenceManager from './ReferenceManager';
import CitationPicker from './CitationPicker';
import {
  exportNoteAsMarkdown,
  exportAllNotesAsMarkdownZip,
  exportCurrentListAsMarkdownZip,
} from '../utils';

export default function AppLayout() {
  const {
    user,
    signIn,
    signOut,
    theme,
    setTheme,
    notes,
    allTags,
    notesError,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    togglePin,
    moveToNotebook,
    emptyTrash,
    notebooks,
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
    noteCountByNotebook,
    totalNotes,
    pinnedCount,
    trashedCount,
    tasksCount,
  } = useNotesContext();

  const {
    activeView,
    setActiveView,
    activeNotebookId,
    setActiveNotebookId,
    activeTag,
    setActiveTag,
    searchQuery,
    setSearchQuery,
    setViewMode,
    showEditor,
    zenMode,
    setZenMode,
    sidebarOpen,
    setSidebarOpen,
    showQuickSwitcher,
    setShowQuickSwitcher,
    showSettings,
    setShowSettings,
    shouldShowOnboarding,
    setShowOnboarding,
    saveStatus,
    isMobile,
    filteredNotes,
    activeNote,
    activeNoteNotebook,
    listTitle,
    normalizedViewMode,
    showEditorPane,
    showPreviewPane,
    splitOrientation,
    handleCreateNote,
    handleSelectNote,
    handleBackToList,
    handleAddTag,
    handleRemoveTag,
    handleDuplicateNote,
    showCitationPicker,
    setShowCitationPicker,
    showReferenceManager,
    setShowReferenceManager,
  } = useUIContext();

  // ── Auth loading / login gates ─────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Loading…
      </div>
    );
  }

  if (user === null) {
    const handleSignIn = async () => {
      try {
        await signIn();
      } catch (e) {
        console.error('Sign in error:', e);
      }
    };
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  // ── Main app shell ─────────────────────────────────────────────────────────
  return (
    <div className={`app${zenMode ? ' zen-mode' : ''}`}>
      <Sidebar
        notebooks={notebooks}
        activeView={activeView}
        setActiveView={setActiveView}
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
        onOpenSettings={() => setShowSettings(true)}
        onCreateNote={handleCreateNote}
      />

      <div
        className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <header className="app-top-nav" role="banner">
          <div className="app-top-nav-left">
            <button
              className={`app-top-nav-link ${
                ['all', 'pinned', 'tag', 'notebook'].includes(activeView)
                  ? 'active'
                  : ''
              }`}
              onClick={() => setActiveView('all')}
            >
              Notes
            </button>
            <button
              className={`app-top-nav-link ${
                activeView === 'kanban' ? 'active' : ''
              }`}
              onClick={() => setActiveView('kanban')}
            >
              Projects
            </button>
            <button
              className={`app-top-nav-link ${
                activeView === 'tasks' ? 'active' : ''
              }`}
              onClick={() => setActiveView('tasks')}
            >
              Tasks
            </button>
            <button
              className="app-top-nav-link"
              onClick={() => setShowReferenceManager(true)}
              title="Open Reference Library"
            >
              <BookMarked size={14} style={{ marginRight: 4 }} />
              References
            </button>
          </div>

          <label className="app-top-nav-search" aria-label="Search notes">
            <Search size={16} className="icon" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find insights..."
            />
          </label>

          <div className="app-top-nav-actions">
            <button
              className="app-top-nav-icon-btn"
              onClick={() => setShowQuickSwitcher(true)}
              title="Quick Switcher"
              aria-label="Open quick switcher"
            >
              <Command size={16} />
            </button>
            <button
              className="app-top-nav-icon-btn"
              title="Notifications"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={16} />
            </button>
            <button
              className="app-top-nav-icon-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
              aria-label="Open settings"
            >
              <SettingsIcon size={16} />
            </button>
            <button
              className="app-top-nav-avatar"
              onClick={() => setShowSettings(true)}
              title={user?.displayName || user?.email || 'User profile'}
              aria-label="Open profile settings"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <span>{user?.displayName?.[0] || user?.email?.[0] || '?'}</span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile top header */}
        <div className="mobile-header">
          {showEditor ? (
            <button className="mobile-header-btn" onClick={handleBackToList}>
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              className="mobile-header-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          )}
          <h1>
            {showEditor && activeNote
              ? activeNote.title || 'Untitled'
              : listTitle}
          </h1>
        </div>

        {/* Workspace */}
        <div
          className={`workspace-panels ${
            activeView === 'kanban' ? 'kanban-panels' : ''
          }`}
        >
          {activeView === 'tasks' ? (
            <div
              style={{ flex: 1, overflow: 'auto', padding: 'var(--space-xl)' }}
            >
              <h2
                style={{
                  marginBottom: 'var(--space-lg)',
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--text-primary)',
                }}
              >
                Tasks
              </h2>
              <TasksView
                notes={notes}
                onUpdateNote={updateNote}
                onSelectNote={(id) => {
                  handleSelectNote(id);
                  setActiveView('all');
                }}
              />
            </div>
          ) : (
            <>
              <NotesList
                className={showEditor ? 'hidden' : ''}
                notes={filteredNotes}
                activeView={activeView}
                activeNoteId={activeNote?.id ?? null}
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
                <div
                  className={`editor-panel ${!showEditor ? 'hidden' : ''}${
                    zenMode || normalizedViewMode === 'edit' ? ' focused-editor' : ''
                  }`}
                  style={!showEditor && isMobile ? { display: 'none' } : {}}
                >
                  {!zenMode && (
                    <NoteToolbar
                      activeNote={activeNote}
                      activeNoteNotebook={activeNoteNotebook}
                      notebooks={notebooks}
                      moveToNotebook={moveToNotebook}
                      togglePin={togglePin}
                      deleteNote={deleteNote}
                      restoreNote={restoreNote}
                      permanentlyDeleteNote={permanentlyDeleteNote}
                      duplicateNote={handleDuplicateNote}
                      saveStatus={saveStatus}
                      notesError={notesError}
                      notes={notes}
                      filteredNotes={filteredNotes}
                      listTitle={listTitle}
                      exportNoteAsMarkdown={exportNoteAsMarkdown}
                      exportAllNotesAsMarkdownZip={exportAllNotesAsMarkdownZip}
                      exportCurrentListAsMarkdownZip={
                        exportCurrentListAsMarkdownZip
                      }
                      isMobile={isMobile}
                      zenMode={zenMode}
                      onToggleZenMode={setZenMode}
                      viewMode={normalizedViewMode}
                      onViewModeChange={setViewMode}
                      onBackToList={handleBackToList}
                      onCite={() => setShowCitationPicker(true)}
                    />
                  )}

                  <input
                    className="editor-title-input"
                    value={activeNote.title}
                    onChange={(e) =>
                      updateNote(activeNote.id, { title: e.target.value })
                    }
                    placeholder="Note title..."
                  />

                  <TagManager
                    tags={activeNote.tags}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />

                  <div className={`editor-content ${normalizedViewMode}`}>
                    {showEditorPane && (
                      <Editor
                        note={activeNote}
                        onUpdateNote={updateNote}
                        notes={notes}
                        zenMode={zenMode}
                        onExitZenMode={() => setZenMode(false)}
                        onNavigateNote={handleSelectNote}
                      />
                    )}
                    {(normalizedViewMode === 'split-horizontal' ||
                      normalizedViewMode === 'split-vertical') && (
                      <div
                        className={`split-divider ${splitOrientation}`}
                      />
                    )}
                    {showPreviewPane && (
                      <Preview
                        content={activeNote.content}
                        notes={notes}
                        onNavigateNote={handleSelectNote}
                      />
                    )}
                  </div>

                  {showEditor && activeNote && (
                    <div className="floating-save-indicator" role="status" aria-live="polite">
                      <span className={`dot${saveStatus === 'error' ? ' error' : ''}`} />
                      <span>
                        {saveStatus === 'saving'
                          ? 'Saving...'
                          : saveStatus === 'error'
                            ? 'Save failed'
                            : 'Auto-saved'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  type={
                    filteredNotes.length === 0 ? 'no-notes' : 'no-selection'
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tab-bar" role="tablist" aria-label="Main navigation">
        <button
          className={`mobile-tab-item ${
            ['all', 'pinned', 'tag', 'notebook'].includes(activeView)
              ? 'active'
              : ''
          }`}
          onClick={() => setActiveView('all')}
          role="tab"
          aria-selected={['all', 'pinned', 'tag', 'notebook'].includes(
            activeView,
          )}
          aria-label="Notes"
        >
          <FileText size={22} aria-hidden="true" />
          <span>Notes</span>
        </button>
        <button
          className={`mobile-tab-item ${
            activeView === 'kanban' ? 'active' : ''
          }`}
          onClick={() => setActiveView('kanban')}
          role="tab"
          aria-selected={activeView === 'kanban'}
          aria-label="Kanban"
        >
          <LayoutGrid size={22} aria-hidden="true" />
          <span>Kanban</span>
        </button>
        <button
          className={`mobile-tab-item ${
            activeView === 'tasks' ? 'active' : ''
          }`}
          onClick={() => setActiveView('tasks')}
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

      {/* Modals */}
      {showQuickSwitcher && (
        <QuickSwitcher
          notes={notes}
          notebooks={notebooks}
          onCreateNote={handleCreateNote}
          onSelect={(id) => {
            handleSelectNote(id);
            setShowQuickSwitcher(false);
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

      {shouldShowOnboarding && (
        <Onboarding
          onComplete={() => setShowOnboarding(false)}
          onCreateNotebook={createNotebook}
        />
      )}

      {showReferenceManager && <ReferenceManager />}

      {showCitationPicker && (
        <CitationPicker
          onInsert={(citation) => {
            if (activeNote) {
              const separator = activeNote.content ? '\n\n' : '';
              updateNote(activeNote.id, {
                content: (activeNote.content || '') + separator + citation,
              });
            }
          }}
        />
      )}
    </div>
  );
}
