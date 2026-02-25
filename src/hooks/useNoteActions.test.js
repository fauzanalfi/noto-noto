import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRef, useState } from 'react';
import { useNoteActions } from './useNoteActions';

const firestore = vi.hoisted(() => ({
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  setDoc: firestore.setDoc,
  updateDoc: firestore.updateDoc,
  deleteDoc: firestore.deleteDoc,
}));

function renderUseNoteActions({ initialNotes = [], userId = 'user-1', generateId = vi.fn(() => 'note-2') } = {}) {
  return renderHook(() => {
    const [notes, setNotes] = useState(initialNotes);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const pendingRef = useRef(0);
    const updateTimers = useRef({});
    const latestUpdateTokenRef = useRef({});

    const trackWrite = (promise, options = {}) => {
      const { onError } = options;
      promise.catch(() => {
        if (onError) onError();
      });
    };

    const actions = useNoteActions({
      userId,
      notes,
      setNotes,
      setSaving,
      setError,
      trackWrite,
      noteRef: (uid, noteId) => `${uid}/${noteId}`,
      generateId,
      setLatestUpdateToken: (id, token) => {
        latestUpdateTokenRef.current[id] = token;
      },
      isLatestUpdateToken: (id, token) => latestUpdateTokenRef.current[id] === token,
      setUpdateTimer: (id, timerId) => {
        updateTimers.current[id] = timerId;
      },
      clearUpdateTimer: (id) => {
        if (updateTimers.current[id]) {
          clearTimeout(updateTimers.current[id]);
          delete updateTimers.current[id];
        }
      },
      incrementPendingWrites: () => {
        pendingRef.current += 1;
      },
      decrementPendingWrites: () => {
        pendingRef.current -= 1;
        return pendingRef.current;
      },
    });

    return { ...actions, notes, saving, error };
  });
}

describe('useNoteActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    firestore.setDoc.mockResolvedValue(undefined);
    firestore.updateDoc.mockResolvedValue(undefined);
    firestore.deleteDoc.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('creates a note optimistically and persists it', async () => {
    const generateId = vi.fn(() => 'new-note');
    const { result } = renderUseNoteActions({ initialNotes: [], generateId });

    let created;
    await act(async () => {
      created = result.current.createNote('resources');
      await Promise.resolve();
    });

    expect(created).toBeTruthy();
    expect(result.current.notes[0].id).toBe('new-note');
    expect(result.current.notes[0].notebookId).toBe('resources');
    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
  });

  it('debounces note updates and writes only after delay', async () => {
    const initialNotes = [{
      id: 'n1',
      title: 'Old',
      content: 'c',
      notebookId: 'resources',
      tags: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      pinned: false,
      trashed: false,
    }];

    const { result } = renderUseNoteActions({ initialNotes });

    act(() => {
      result.current.updateNote('n1', { title: 'New' });
    });

    expect(result.current.notes[0].title).toBe('New');
    expect(firestore.updateDoc).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(800);
      await Promise.resolve();
    });

    expect(firestore.updateDoc).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('does not write when adding a duplicate tag', () => {
    const initialNotes = [{
      id: 'n1',
      title: 'Tagged',
      content: '',
      notebookId: 'resources',
      tags: ['work'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      pinned: false,
      trashed: false,
    }];

    const { result } = renderUseNoteActions({ initialNotes });

    act(() => {
      result.current.addTag('n1', 'work');
    });

    expect(result.current.notes[0].tags).toEqual(['work']);
    expect(firestore.updateDoc).not.toHaveBeenCalled();
  });
});
