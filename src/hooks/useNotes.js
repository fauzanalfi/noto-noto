import { useState, useCallback, useEffect, useRef } from 'react';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateId, WELCOME_NOTE_CONTENT } from '../utils';

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

  useEffect(() => {
    Object.values(updateTimers.current).forEach((timerId) => clearTimeout(timerId));
    updateTimers.current = {};
    latestUpdateTokenRef.current = {};

    if (!userId) {
      setNotes([]);
      setLoading(false);
      setSaving(false);
      setError(null);
      hasSeededWelcomeRef.current = false;
      return;
    }

    setLoading(true);
    setError(null);

    const notesQuery = query(notesRef(userId), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(
      notesQuery,
      (snap) => {
        if (snap.empty) {
          if (!hasSeededWelcomeRef.current) {
            hasSeededWelcomeRef.current = true;
            const welcome = makeWelcomeNote();
            setNotes([welcome]);
            trackWrite(setDoc(noteRef(userId, welcome.id), welcome), {
              message: 'Failed to create welcome note.',
              onError: () => setNotes([]),
            });
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
      unsubscribe();
      Object.values(updateTimers.current).forEach((timerId) => clearTimeout(timerId));
      updateTimers.current = {};
    };
  }, [userId, trackWrite]);

  const createNote = useCallback((notebookId = 'resources') => {
    if (!userId) return null;
    const now = new Date().toISOString();
    const note = {
      id: generateId(),
      title: '',
      content: '',
      notebookId,
      tags: [],
      createdAt: now,
      updatedAt: now,
      pinned: false,
      trashed: false,
    };
    setNotes((prev) => [note, ...prev]);
    trackWrite(setDoc(noteRef(userId, note.id), note), {
      message: 'Failed to create note.',
      onError: () => setNotes((prev) => prev.filter((n) => n.id !== note.id)),
    });
    return note;
  }, [userId, trackWrite]);

  const updateNote = useCallback((id, updates) => {
    if (!userId) return;
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    const updateToken = Date.now() + Math.random();
    latestUpdateTokenRef.current[id] = updateToken;

    let previousNote = null;
    setNotes((prev) => {
      previousNote = prev.find((n) => n.id === id) || null;
      return prev.map((n) => (n.id === id ? { ...n, ...updated } : n));
    });

    setSaving(true);
    setError(null);
    if (updateTimers.current[id]) clearTimeout(updateTimers.current[id]);
    updateTimers.current[id] = setTimeout(() => {
      pendingRef.current += 1;
      updateDoc(noteRef(userId, id), updated)
        .catch((writeError) => {
          const isLatest = latestUpdateTokenRef.current[id] === updateToken;
          if (isLatest && previousNote) {
            setNotes((prev) => prev.map((n) => (n.id === id ? previousNote : n)));
          }
          setError('Failed to save note changes. Please retry.');
          console.error(writeError);
        })
        .finally(() => {
          pendingRef.current -= 1;
          if (pendingRef.current === 0) setSaving(false);
          delete updateTimers.current[id];
        });
    }, 800);
  }, [userId]);

  const deleteNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: true, updatedAt: new Date().toISOString() };
    const originalNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to move note to trash.',
      onError: () => {
        if (!originalNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? originalNote : n)));
      },
    });
  }, [userId, notes, trackWrite]);

  const restoreNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: false, updatedAt: new Date().toISOString() };
    const originalNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to restore note.',
      onError: () => {
        if (!originalNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? originalNote : n)));
      },
    });
  }, [userId, notes, trackWrite]);

  const permanentlyDeleteNote = useCallback((id) => {
    if (!userId) return;
    const removedNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    trackWrite(deleteDoc(noteRef(userId, id)), {
      message: 'Failed to permanently delete note.',
      onError: () => {
        if (!removedNote) return;
        setNotes((prev) => [removedNote, ...prev]);
      },
    });
  }, [userId, notes, trackWrite]);

  const emptyTrash = useCallback(() => {
    if (!userId) return;
    const trashed = notes.filter((n) => n.trashed);
    setNotes((prev) => prev.filter((n) => !n.trashed));
    Promise.all(trashed.map((n) => deleteDoc(noteRef(userId, n.id))))
      .catch((writeError) => {
        setNotes((prev) => [...trashed, ...prev]);
        setError('Failed to empty trash. Please try again.');
        console.error(writeError);
      });
  }, [userId, notes]);

  const duplicateNote = useCallback((id) => {
    if (!userId) return null;
    const note = notes.find((n) => n.id === id);
    if (!note) return null;
    const now = new Date().toISOString();
    const copy = {
      ...note,
      id: generateId(),
      title: note.title ? `${note.title} (Copy)` : 'Untitled (Copy)',
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };
    setNotes((prev) => [copy, ...prev]);
    trackWrite(setDoc(noteRef(userId, copy.id), copy), {
      message: 'Failed to duplicate note.',
      onError: () => setNotes((prev) => prev.filter((n) => n.id !== copy.id)),
    });
    return copy;
  }, [userId, notes, trackWrite]);

  const togglePin = useCallback((id) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const updated = { pinned: !note.pinned, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to update pin state.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, trackWrite]);

  const moveToNotebook = useCallback((id, notebookId) => {
    if (!userId) return;
    const previousNote = notes.find((n) => n.id === id);
    const updated = { notebookId, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to move note to notebook.',
      onError: () => {
        if (!previousNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? previousNote : n)));
      },
    });
  }, [userId, notes, trackWrite]);

  const addTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note || note.tags.includes(tag)) return;
    const tags = [...note.tags, tag];
    const updated = { tags, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to add tag.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, trackWrite]);

  const removeTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const tags = note.tags.filter((t) => t !== tag);
    const updated = { tags, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated), {
      message: 'Failed to remove tag.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, trackWrite]);

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
