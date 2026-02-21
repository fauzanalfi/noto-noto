import { useState, useCallback, useEffect, useRef } from 'react';
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc,
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
  const pendingRef = useRef(0);
  const updateTimers = useRef({});

  const trackWrite = useCallback((promise) => {
    pendingRef.current += 1;
    setSaving(true);
    promise
      .catch(console.error)
      .finally(() => {
        pendingRef.current -= 1;
        if (pendingRef.current === 0) setSaving(false);
      });
  }, []);

  // Load notes from Firestore on mount / user change
  useEffect(() => {
    if (!userId) { setNotes([]); setLoading(false); return; }
    setLoading(true);
    getDocs(notesRef(userId))
      .then((snap) => {
        if (snap.empty) {
          const welcome = makeWelcomeNote();
          trackWrite(setDoc(noteRef(userId, welcome.id), welcome));
          setNotes([welcome]);
        } else {
          setNotes(snap.docs.map((d) => d.data()));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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
    trackWrite(setDoc(noteRef(userId, note.id), note));
    return note;
  }, [userId, trackWrite]);

  const updateNote = useCallback((id, updates) => {
    if (!userId) return;
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    // Debounce Firestore writes to avoid per-keystroke writes
    setSaving(true);
    if (updateTimers.current[id]) clearTimeout(updateTimers.current[id]);
    updateTimers.current[id] = setTimeout(() => {
      pendingRef.current += 1;
      updateDoc(noteRef(userId, id), updated)
        .catch(console.error)
        .finally(() => {
          pendingRef.current -= 1;
          if (pendingRef.current === 0) setSaving(false);
        });
    }, 800);
  }, [userId]);

  const deleteNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: true, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated));
  }, [userId, trackWrite]);

  const restoreNote = useCallback((id) => {
    if (!userId) return;
    const updated = { trashed: false, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated));
  }, [userId, trackWrite]);

  const permanentlyDeleteNote = useCallback((id) => {
    if (!userId) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    trackWrite(deleteDoc(noteRef(userId, id)));
  }, [userId, trackWrite]);

  const emptyTrash = useCallback(() => {
    if (!userId) return;
    const trashed = notes.filter((n) => n.trashed);
    setNotes((prev) => prev.filter((n) => !n.trashed));
    trashed.forEach((n) => trackWrite(deleteDoc(noteRef(userId, n.id))));
  }, [userId, notes, trackWrite]);

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
    trackWrite(setDoc(noteRef(userId, copy.id), copy));
    return copy;
  }, [userId, notes, trackWrite]);

  const togglePin = useCallback((id) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const updated = { pinned: !note.pinned, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated));
  }, [userId, notes, trackWrite]);

  const moveToNotebook = useCallback((id, notebookId) => {
    if (!userId) return;
    const updated = { notebookId, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    trackWrite(updateDoc(noteRef(userId, id), updated));
  }, [userId, trackWrite]);

  const addTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note || note.tags.includes(tag)) return;
    const tags = [...note.tags, tag];
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDoc(noteRef(userId, id), { tags }));
  }, [userId, notes, trackWrite]);

  const removeTag = useCallback((id, tag) => {
    if (!userId) return;
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const tags = note.tags.filter((t) => t !== tag);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, tags } : n)));
    trackWrite(updateDoc(noteRef(userId, id), { tags }));
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
    emptyTrash,
    duplicateNote,
  };
}
