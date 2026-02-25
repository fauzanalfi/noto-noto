import { useState, useCallback, useEffect, useRef } from 'react';
import {
  collection, doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateId, WELCOME_NOTE_CONTENT } from '../utils';
import { useNoteActions } from './useNoteActions';
import { isDemoMode } from '../runtime';

const demoNotesKey = (userId) => `noto-demo-notes-${userId}`;

function makeWelcomeNote() {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: 'Welcome to Noto!',
    content: WELCOME_NOTE_CONTENT,
    notebookId: 'resources',
    tags: ['welcome', 'getting-started'],
    createdAt: now,
    updatedAt: now,
    pinned: true,
    trashed: false,
  };
}

function notesRef(userId) { return collection(db, 'users', userId, 'notes'); }
function noteRef(userId, noteId) { return doc(db, 'users', userId, 'notes', noteId); }

export function useNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const pendingRef = useRef(0);
  const updateTimers = useRef({});
  const latestUpdateTokenRef = useRef({});
  const hasSeededWelcomeRef = useRef(false);

  const trackWrite = useCallback((promise, options = {}) => {
    const { message = 'Failed to save note changes.', onError } = options;
    pendingRef.current += 1;
    setSaving(true);
    setError(null);
    promise
      .catch((writeError) => {
        if (onError) onError();
        setError(message);
        console.error(writeError);
      })
      .finally(() => {
        pendingRef.current -= 1;
        if (pendingRef.current === 0) setSaving(false);
      });
  }, []);

  const setLatestUpdateToken = useCallback((id, token) => {
    latestUpdateTokenRef.current[id] = token;
  }, []);

  const isLatestUpdateToken = useCallback((id, token) => (
    latestUpdateTokenRef.current[id] === token
  ), []);

  const setUpdateTimer = useCallback((id, timerId) => {
    updateTimers.current[id] = timerId;
  }, []);

  const clearUpdateTimer = useCallback((id) => {
    const timerId = updateTimers.current[id];
    if (!timerId) return;
    clearTimeout(timerId);
    delete updateTimers.current[id];
  }, []);

  const incrementPendingWrites = useCallback(() => {
    pendingRef.current += 1;
    return pendingRef.current;
  }, []);

  const decrementPendingWrites = useCallback(() => {
    pendingRef.current -= 1;
    return pendingRef.current;
  }, []);

  const {
    seedWelcomeNote,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    emptyTrash,
    duplicateNote,
    togglePin,
    moveToNotebook,
    addTag,
    removeTag,
  } = useNoteActions({
    userId,
    notes,
    setNotes,
    setSaving,
    setError,
    trackWrite,
    noteRef,
    generateId,
    setLatestUpdateToken,
    isLatestUpdateToken,
    setUpdateTimer,
    clearUpdateTimer,
    incrementPendingWrites,
    decrementPendingWrites,
    setDocFn: isDemoMode ? () => Promise.resolve() : undefined,
    updateDocFn: isDemoMode ? () => Promise.resolve() : undefined,
    deleteDocFn: isDemoMode ? () => Promise.resolve() : undefined,
  });

  useEffect(() => {
    Object.values(updateTimers.current).forEach((timerId) => clearTimeout(timerId));
    updateTimers.current = {};
    latestUpdateTokenRef.current = {};

    if (!userId) {
      const resetTimer = setTimeout(() => {
        setNotes([]);
        setLoading(false);
        setSaving(false);
        setError(null);
        hasSeededWelcomeRef.current = false;
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    if (isDemoMode) {
      const startSyncTimer = setTimeout(() => {
        setLoading(true);
        setError(null);

        let existingNotes = [];
        try {
          existingNotes = JSON.parse(localStorage.getItem(demoNotesKey(userId)) || '[]');
        } catch {
          existingNotes = [];
        }

        if (existingNotes.length === 0) {
          const welcome = makeWelcomeNote();
          setNotes([welcome]);
        } else {
          setNotes(existingNotes);
        }
        setLoading(false);
      }, 0);

      return () => {
        clearTimeout(startSyncTimer);
        Object.values(updateTimers.current).forEach((timerId) => clearTimeout(timerId));
        updateTimers.current = {};
      };
    }

    const startSyncTimer = setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    const notesQuery = query(notesRef(userId), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(
      notesQuery,
      (snap) => {
        if (snap.empty) {
          if (!hasSeededWelcomeRef.current) {
            hasSeededWelcomeRef.current = true;
            const welcome = makeWelcomeNote();
            seedWelcomeNote(welcome);
          } else {
            setNotes([]);
          }
        } else {
          hasSeededWelcomeRef.current = true;
          setNotes(snap.docs.map((d) => d.data()));
        }
        setLoading(false);
      },
      (snapshotError) => {
        setError('Failed to sync notes. Please refresh and try again.');
        setLoading(false);
        console.error(snapshotError);
      }
    );

    return () => {
      clearTimeout(startSyncTimer);
      unsubscribe();
      Object.values(updateTimers.current).forEach((timerId) => clearTimeout(timerId));
      updateTimers.current = {};
    };
  }, [userId, seedWelcomeNote]);

  useEffect(() => {
    if (!isDemoMode || !userId || loading) return;
    try {
      localStorage.setItem(demoNotesKey(userId), JSON.stringify(notes));
    } catch {
      console.error('Failed to save local demo notes.');
    }
  }, [notes, userId, loading]);

  // Get all unique tags
  const allTags = [...new Set(notes.filter((n) => !n.trashed).flatMap((n) => n.tags))].sort();

  // Get notes filtered
  const getFilteredNotes = useCallback(
    (filters = {}) => {
      let filtered = notes;

      if (filters.trashed) {
        filtered = filtered.filter((n) => n.trashed);
      } else {
        filtered = filtered.filter((n) => !n.trashed);
      }

      if (filters.notebookId && filters.notebookId !== 'all') {
        filtered = filtered.filter((n) => n.notebookId === filters.notebookId);
      }

      if (filters.pinned) {
        filtered = filtered.filter((n) => n.pinned);
      }

      if (filters.tag) {
        filtered = filtered.filter((n) => n.tags.includes(filters.tag));
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      // Sort: pinned first, then by updatedAt descending
      filtered.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      return filtered;
    },
    [notes]
  );

  return {
    notes,
    loading,
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
    error,
    clearError: () => setError(null),
    emptyTrash,
    duplicateNote,
  };
}
