import { createContext, useContext, useMemo } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useNotebooks } from '../hooks/useNotebooks';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useReferences } from '../hooks/useReferences';

const NotesContext = createContext(null);

/**
 * NotesProvider owns all data-layer state: auth, theme, notes, and notebooks.
 * It exposes raw data, derived counts, and every CRUD action so that any
 * descendant can call useNotesContext() instead of receiving 20 props.
 */
export function NotesProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const { user, signIn, signOut } = useAuth();

  // ── Theme ─────────────────────────────────────────────────────────────────
  const { theme, setTheme } =
    useTheme();

  // ── Notes & notebooks (keyed to the current user) ─────────────────────────
  const {
    notes,
    allTags,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    togglePin,
    moveToNotebook,
    addTag,
    removeTag,
    getFilteredNotes,
    saving,
    emptyTrash,
    duplicateNote,
    error: notesError,
    getBacklinks,
    getOutgoingLinks,
    getBrokenLinks,
    getLinkGraph,
  } = useNotes(user?.uid);

  const {
    notebooks,
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
  } = useNotebooks(user?.uid);

  // ── References ────────────────────────────────────────────────────────────
  const {
    references,
    allRefTags,
    createReference,
    updateReference,
    deleteReference,
    searchReferences,
  } = useReferences(user?.uid);

  // ── Derived counts (used by Sidebar badges) ───────────────────────────────
  const noteCountByNotebook = useMemo(() => {
    const counts = {};
    notes
      .filter((n) => !n.trashed)
      .forEach((n) => {
        counts[n.notebookId] = (counts[n.notebookId] || 0) + 1;
      });
    return counts;
  }, [notes]);

  const { totalNotes, pinnedCount, trashedCount, tasksCount } = useMemo(() => {
    let tasks = 0;
    notes
      .filter((n) => !n.trashed && n.content)
      .forEach((n) => {
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

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      // Auth
      user,
      signIn,
      signOut,

      // Theme
      theme,
      setTheme,

      // Notes data & actions
      notes,
      allTags,
      saving,
      notesError,
      createNote,
      updateNote,
      deleteNote,
      restoreNote,
      permanentlyDeleteNote,
      togglePin,
      moveToNotebook,
      addTag,
      removeTag,
      getFilteredNotes,
      emptyTrash,
      duplicateNote,

      // Notebooks data & actions
      notebooks,
      createNotebook,
      renameNotebook,
      deleteNotebook,
      moveNotebookCategory,

      // References data & actions
      references,
      allRefTags,
      createReference,
      updateReference,
      deleteReference,
      searchReferences,

      // Link graph helpers
      getBacklinks,
      getOutgoingLinks,
      getBrokenLinks,
      getLinkGraph,

      // Derived counts
      noteCountByNotebook,
      totalNotes,
      pinnedCount,
      trashedCount,
      tasksCount,
    }),
    [
      user,
      signIn,
      signOut,
      theme,
      setTheme,
      notes,
      allTags,
      saving,
      notesError,
      createNote,
      updateNote,
      deleteNote,
      restoreNote,
      permanentlyDeleteNote,
      togglePin,
      moveToNotebook,
      addTag,
      removeTag,
      getFilteredNotes,
      emptyTrash,
      duplicateNote,
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
      references,
      allRefTags,
      createReference,
      updateReference,
      deleteReference,
      searchReferences,
      getBacklinks,
      getOutgoingLinks,
      getBrokenLinks,
      getLinkGraph,
    ],
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

/**
 * Consume the notes/notebooks/auth/theme data layer from any descendant.
 * Throws if used outside of <NotesProvider>.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useNotesContext() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotesContext must be used inside <NotesProvider>');
  }
  return ctx;
}
