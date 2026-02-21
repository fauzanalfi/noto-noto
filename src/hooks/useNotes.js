import { useState, useCallback, useEffect, useRef } from 'react';
import { generateId, WELCOME_NOTE_CONTENT } from '../utils';

const STORAGE_KEY = 'noto-notes';

function loadNotes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load notes', e);
  }
  // Create a welcome note
  const now = new Date().toISOString();
  return [
    {
      id: generateId(),
      title: 'Welcome to Noto!',
      content: WELCOME_NOTE_CONTENT,
      notebookId: 'resources',
      tags: ['welcome', 'getting-started'],
      createdAt: now,
      updatedAt: now,
      pinned: true,
      trashed: false,
    },
  ];
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState(loadNotes);
  const saveTimer = useRef(null);

  // Persist notes on change (debounced)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveNotes(notes);
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [notes]);

  const createNote = useCallback((notebookId = 'resources') => {
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
    return note;
  }, []);

  const updateNote = useCallback((id, updates) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: true } : n))
    );
  }, []);

  const restoreNote = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: false } : n))
    );
  }, []);

  const permanentlyDeleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePin = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  }, []);

  const moveToNotebook = useCallback((id, notebookId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, notebookId, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const addTag = useCallback((id, tag) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id && !n.tags.includes(tag)
          ? { ...n, tags: [...n.tags, tag] }
          : n
      )
    );
  }, []);

  const removeTag = useCallback((id, tag) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, tags: n.tags.filter((t) => t !== tag) } : n
      )
    );
  }, []);

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
  };
}
