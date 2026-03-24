import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useNotesContext } from './NotesContext';
import { useDebounce } from '../hooks/useDebounce';

const UIContext = createContext(null);

/**
 * UIProvider owns all view-level state:
 *   - which view / notebook / tag is active
 *   - search query (raw + debounced)
 *   - editor / split / zen / sidebar / modal visibility
 *   - save-status indicator
 *   - window width → isMobile flag
 *   - derived values: filteredNotes, activeNote, listTitle, layout flags
 *   - global keyboard shortcuts
 *
 * It sits *inside* NotesProvider so it can read from useNotesContext().
 */
export function UIProvider({ children }) {
  const {
    user,
    notes,
    notebooks,
    saving,
    notesError,
    createNote,
    addTag,
    removeTag,
    duplicateNote,
    getFilteredNotes,
  } = useNotesContext();

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ── View selection ─────────────────────────────────────────────────────────
  const [activeView, setActiveViewRaw] = useState('all');
  const [activeNotebookId, setActiveNotebookId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);

  /** Switch views and always clear the search so results are unfiltered. */
  const setActiveView = useCallback((view) => {
    setActiveViewRaw(view);
    setSearchQuery('');
  }, []);

  // ── Editor / layout toggles ────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState('split-horizontal');
  const [showEditor, setShowEditor] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCitationPicker, setShowCitationPicker] = useState(false);
  const [showReferenceManager, setShowReferenceManager] = useState(false);

  const shouldShowOnboarding =
    showOnboarding || Boolean(user && !localStorage.getItem('noto-onboarded'));

  // ── Save status indicator ──────────────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState(null);
  const prevSavingRef = useRef(saving);

  useEffect(() => {
    if (prevSavingRef.current === saving) return;
    prevSavingRef.current = saving;

    let timer;
    if (saving) {
      timer = setTimeout(() => setSaveStatus('saving'), 0);
    } else if (notesError) {
      timer = setTimeout(() => setSaveStatus('error'), 0);
    } else {
      timer = setTimeout(() => {
        setSaveStatus('saved');
        const clearTimer = setTimeout(() => setSaveStatus(null), 2000);
        return () => clearTimeout(clearTimer);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [saving, notesError]);

  // ── Window width / mobile detection ───────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // ── Filtered notes ─────────────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    const filters = { search: debouncedSearchQuery };
    if (activeView === 'trash') filters.trashed = true;
    else if (activeView === 'pinned') filters.pinned = true;
    else if (activeView === 'tasks') return notes.filter((n) => !n.trashed);
    else if (activeView === 'notebook') filters.notebookId = activeNotebookId;
    else if (activeView === 'tag') filters.tag = activeTag;
    return getFilteredNotes(filters);
  }, [
    activeView,
    activeNotebookId,
    activeTag,
    debouncedSearchQuery,
    getFilteredNotes,
    notes,
  ]);

  // ── Active note ────────────────────────────────────────────────────────────
  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) ?? null,
    [notes, activeNoteId],
  );

  const activeNoteNotebook = useMemo(
    () =>
      activeNote
        ? (notebooks.find((nb) => nb.id === activeNote.notebookId) ?? null)
        : null,
    [activeNote, notebooks],
  );

  // ── List title ─────────────────────────────────────────────────────────────
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

  // ── Layout flags ───────────────────────────────────────────────────────────
  const normalizedViewMode = useMemo(() => {
    if (viewMode === 'split') return 'split-horizontal';
    if (['edit', 'split-horizontal', 'split-vertical', 'preview'].includes(viewMode))
      return viewMode;
    return 'edit';
  }, [viewMode]);

  const showEditorPane =
    normalizedViewMode === 'edit' ||
    normalizedViewMode === 'split-horizontal' ||
    normalizedViewMode === 'split-vertical';

  const showPreviewPane =
    normalizedViewMode === 'preview' ||
    normalizedViewMode === 'split-horizontal' ||
    normalizedViewMode === 'split-vertical';

  const splitOrientation =
    normalizedViewMode === 'split-vertical' ? 'vertical' : 'horizontal';

  // ── Note action handlers ───────────────────────────────────────────────────
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

  const handleAddTag = useCallback(
    (tag) => {
      if (activeNote) addTag(activeNote.id, tag);
    },
    [activeNote, addTag],
  );

  const handleRemoveTag = useCallback(
    (tag) => {
      if (activeNote) removeTag(activeNote.id, tag);
    },
    [activeNote, removeTag],
  );

  const handleDuplicateNote = useCallback(
    (id) => {
      const copy = duplicateNote(id);
      if (copy) {
        setActiveNoteId(copy.id);
        setShowEditor(true);
      }
    },
    [duplicateNote],
  );

  // ── Global keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;

      // ⌘N / Ctrl+N — new note
      if (mod && e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
        return;
      }

      // ⌘K / Ctrl+K — quick switcher
      if (mod && e.key === 'k') {
        e.preventDefault();
        setShowQuickSwitcher((v) => !v);
        return;
      }

      // ⌘S / Ctrl+S — force-save feedback (saves are automatic)
      if (mod && e.key === 's') {
        e.preventDefault();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 1500);
        return;
      }

      // ⌘F / Ctrl+F — focus search
      if (mod && e.key === 'f') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('noto:focus-search'));
        return;
      }

      // ⌘1–4 — view mode shortcuts (skip when user is typing)
      const tag = document.activeElement?.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
      if (mod && !inInput) {
        if (e.key === '1') { e.preventDefault(); setViewMode('edit'); return; }
        if (e.key === '2') { e.preventDefault(); setViewMode('preview'); return; }
        if (e.key === '3') { e.preventDefault(); setViewMode('split-horizontal'); return; }
        if (e.key === '4') { e.preventDefault(); setZenMode((v) => !v); return; }
      }

      // Escape — close modals / exit zen
      if (e.key === 'Escape') {
        if (showQuickSwitcher) { setShowQuickSwitcher(false); return; }
        if (showSettings)      { setShowSettings(false);      return; }
        if (showCitationPicker){ setShowCitationPicker(false); return; }
        if (showReferenceManager){ setShowReferenceManager(false); return; }
        if (shouldShowOnboarding) return; // don't dismiss onboarding with Esc
        if (zenMode)           { setZenMode(false);           return; }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleCreateNote,
    showQuickSwitcher,
    showSettings,
    showCitationPicker,
    showReferenceManager,
    shouldShowOnboarding,
    zenMode,
  ]);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      // View selection
      activeView,
      setActiveView,
      activeNotebookId,
      setActiveNotebookId,
      activeTag,
      setActiveTag,
      activeNoteId,
      setActiveNoteId,

      // Search
      searchQuery,
      setSearchQuery,

      // Editor / layout
      viewMode,
      setViewMode,
      showEditor,
      setShowEditor,
      zenMode,
      setZenMode,
      sidebarOpen,
      setSidebarOpen,

      // Modals
      showQuickSwitcher,
      setShowQuickSwitcher,
      showSettings,
      setShowSettings,
      showOnboarding,
      setShowOnboarding,
      shouldShowOnboarding,
      showCitationPicker,
      setShowCitationPicker,
      showReferenceManager,
      setShowReferenceManager,

      // Save status
      saveStatus,
      setSaveStatus,

      // Responsive
      isMobile,

      // Derived data
      filteredNotes,
      activeNote,
      activeNoteNotebook,
      listTitle,

      // Layout flags
      normalizedViewMode,
      showEditorPane,
      showPreviewPane,
      splitOrientation,

      // Handlers
      handleCreateNote,
      handleSelectNote,
      handleBackToList,
      handleAddTag,
      handleRemoveTag,
      handleDuplicateNote,
    }),
    [
      activeView,
      setActiveView,
      activeNotebookId,
      activeTag,
      activeNoteId,
      searchQuery,
      viewMode,
      showEditor,
      zenMode,
      sidebarOpen,
      showQuickSwitcher,
      showSettings,
      showOnboarding,
      shouldShowOnboarding,
      showCitationPicker,
      showReferenceManager,
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
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * Consume the UI-layer state from any descendant.
 * Throws if used outside of <UIProvider>.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUIContext must be used inside <UIProvider>');
  }
  return ctx;
}
