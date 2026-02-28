import { useCallback } from 'react';
import {
  deleteDoc as firebaseDeleteDoc,
  setDoc as firebaseSetDoc,
  updateDoc as firebaseUpdateDoc,
} from 'firebase/firestore';

export function useNoteActions({
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
  setDocFn = firebaseSetDoc,
  updateDocFn = firebaseUpdateDoc,
  deleteDocFn = firebaseDeleteDoc,
}) {
  const seedWelcomeNote = useCallback((welcomeNote) => {
    if (!userId) return;
    setNotes([welcomeNote]);
    trackWrite(setDocFn(noteRef(userId, welcomeNote.id), welcomeNote), {
      message: 'Failed to create welcome note.',
      onError: () => setNotes([]),
    });
  }, [userId, setNotes, trackWrite, noteRef, setDocFn]);

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
      status: 'backlog',
    };
    setNotes((prev) => [note, ...prev]);
    trackWrite(setDocFn(noteRef(userId, note.id), note), {
      message: 'Failed to create note.',
      onError: () => setNotes((prev) => prev.filter((n) => n.id !== note.id)),
    });
    return note;
  }, [userId, generateId, setNotes, trackWrite, noteRef, setDocFn]);

  const updateNote = useCallback((id, updates) => {
    if (!userId) return;
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    const updateToken = Date.now() + Math.random();
    setLatestUpdateToken(id, updateToken);

    let previousNote = null;
    setNotes((prev) => {
      previousNote = prev.find((n) => n.id === id) || null;
      return prev.map((n) => (n.id === id ? { ...n, ...updated } : n));
    });

    setSaving(true);
    setError(null);
    clearUpdateTimer(id);
    setUpdateTimer(id, setTimeout(() => {
      incrementPendingWrites();
      updateDocFn(noteRef(userId, id), updated)
        .catch((writeError) => {
          const isLatest = isLatestUpdateToken(id, updateToken);
          if (isLatest && previousNote) {
            setNotes((prev) => prev.map((n) => (n.id === id ? previousNote : n)));
          }
          setError('Failed to save note changes. Please retry.');
          console.error(writeError);
        })
        .finally(() => {
          const remaining = decrementPendingWrites();
          if (remaining === 0) setSaving(false);
          clearUpdateTimer(id);
        });
    }, 800));
  }, [
    userId,
    setLatestUpdateToken,
    setNotes,
    setSaving,
    setError,
    clearUpdateTimer,
    setUpdateTimer,
    incrementPendingWrites,
    isLatestUpdateToken,
    decrementPendingWrites,
    noteRef,
    updateDocFn,
  ]);

  const deleteNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: true, updatedAt: new Date().toISOString() };
    const originalNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to move note to trash.',
      onError: () => {
        if (!originalNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? originalNote : n)));
      },
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  const restoreNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: false, updatedAt: new Date().toISOString() };
    const originalNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to restore note.',
      onError: () => {
        if (!originalNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? originalNote : n)));
      },
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  const permanentlyDeleteNote = useCallback((id) => {
    if (!userId) return;
    const removedNote = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    trackWrite(deleteDocFn(noteRef(userId, id)), {
      message: 'Failed to permanently delete note.',
      onError: () => {
        if (!removedNote) return;
        setNotes((prev) => [removedNote, ...prev]);
      },
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, deleteDocFn]);

  const emptyTrash = useCallback(() => {
    if (!userId) return;
    const trashed = notes.filter((n) => n.trashed);
    setNotes((prev) => prev.filter((n) => !n.trashed));
    Promise.all(trashed.map((n) => deleteDocFn(noteRef(userId, n.id))))
      .catch((writeError) => {
        setNotes((prev) => [...trashed, ...prev]);
        setError('Failed to empty trash. Please try again.');
        console.error(writeError);
      });
  }, [userId, notes, setNotes, setError, noteRef, deleteDocFn]);

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
    trackWrite(setDocFn(noteRef(userId, copy.id), copy), {
      message: 'Failed to duplicate note.',
      onError: () => setNotes((prev) => prev.filter((n) => n.id !== copy.id)),
    });
    return copy;
  }, [userId, notes, generateId, setNotes, trackWrite, noteRef, setDocFn]);

  const togglePin = useCallback((id) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const updated = { pinned: !note.pinned, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to update pin state.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  const moveToNotebook = useCallback((id, notebookId) => {
    if (!userId) return;
    const previousNote = notes.find((n) => n.id === id);
    const updated = { notebookId, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to move note to notebook.',
      onError: () => {
        if (!previousNote) return;
        setNotes((prev) => prev.map((n) => (n.id === id ? previousNote : n)));
      },
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  const addTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note || note.tags.includes(tag)) return;
    const tags = [...note.tags, tag];
    const updated = { tags, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to add tag.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  const removeTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const tags = note.tags.filter((t) => t !== tag);
    const updated = { tags, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDocFn(noteRef(userId, id), updated), {
      message: 'Failed to remove tag.',
      onError: () => setNotes((prev) => prev.map((n) => (n.id === id ? note : n))),
    });
  }, [userId, notes, setNotes, trackWrite, noteRef, updateDocFn]);

  return {
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
  };
}