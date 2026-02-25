import { useState, useCallback, useEffect } from 'react';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateId, DEFAULT_PARA_CATEGORIES } from '../utils';
import { isDemoMode } from '../runtime';

const demoNotebooksKey = (userId) => `noto-demo-notebooks-${userId}`;

function defaultNotebooks() {
  return DEFAULT_PARA_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    paraCategory: cat.id,
    createdAt: new Date().toISOString(),
  }));
}

function notebooksRef(userId) { return collection(db, 'users', userId, 'notebooks'); }
function notebookRef(userId, nbId) { return doc(db, 'users', userId, 'notebooks', nbId); }

export function useNotebooks(userId) {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      const resetTimer = setTimeout(() => {
        setNotebooks([]);
        setLoading(false);
        setError(null);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    if (isDemoMode) {
      const startSyncTimer = setTimeout(() => {
        setLoading(true);
        setError(null);

        let existingNotebooks = [];
        try {
          existingNotebooks = JSON.parse(localStorage.getItem(demoNotebooksKey(userId)) || '[]');
        } catch {
          existingNotebooks = [];
        }

        if (existingNotebooks.length === 0) {
          setNotebooks(defaultNotebooks());
        } else {
          setNotebooks(existingNotebooks);
        }
        setLoading(false);
      }, 0);

      return () => clearTimeout(startSyncTimer);
    }

    const startSyncTimer = setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    let hasSeededDefaults = false;
    const unsubscribe = onSnapshot(
      notebooksRef(userId),
      (snap) => {
        if (snap.empty) {
          if (!hasSeededDefaults) {
            hasSeededDefaults = true;
            const defaults = defaultNotebooks();
            setNotebooks(defaults);
            Promise.all(defaults.map((nb) => setDoc(notebookRef(userId, nb.id), nb))).catch((writeError) => {
              setError('Failed to create default notebooks.');
              console.error(writeError);
            });
          } else {
            setNotebooks([]);
          }
        } else {
          hasSeededDefaults = true;
          setNotebooks(snap.docs.map((d) => d.data()));
        }
        setLoading(false);
      },
      (snapshotError) => {
        setLoading(false);
        setError('Failed to sync notebooks. Please refresh and try again.');
        console.error(snapshotError);
      }
    );

    return () => {
      clearTimeout(startSyncTimer);
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (!isDemoMode || !userId || loading) return;
    try {
      localStorage.setItem(demoNotebooksKey(userId), JSON.stringify(notebooks));
    } catch {
      console.error('Failed to save local demo notebooks.');
    }
  }, [notebooks, userId, loading]);

  const createNotebook = useCallback((name, paraCategory = 'resources') => {
    if (!userId) return null;
    const paraCat = DEFAULT_PARA_CATEGORIES.find((c) => c.id === paraCategory) || DEFAULT_PARA_CATEGORIES[2];
    const nb = {
      id: generateId(),
      name,
      color: paraCat.color,
      icon: paraCat.icon,
      paraCategory,
      createdAt: new Date().toISOString(),
    };
    setNotebooks((prev) => [...prev, nb]);
    setError(null);

    if (isDemoMode) return nb;

    setDoc(notebookRef(userId, nb.id), nb).catch((writeError) => {
      setNotebooks((prev) => prev.filter((item) => item.id !== nb.id));
      setError('Failed to create notebook.');
      console.error(writeError);
    });
    return nb;
  }, [userId]);

  const renameNotebook = useCallback((id, name) => {
    if (!userId) return;
    const previousNotebook = notebooks.find((nb) => nb.id === id);
    setNotebooks((prev) => prev.map((nb) => (nb.id === id ? { ...nb, name } : nb)));
    setError(null);

    if (isDemoMode) return;

    updateDoc(notebookRef(userId, id), { name }).catch((writeError) => {
      if (previousNotebook) {
        setNotebooks((prev) => prev.map((nb) => (nb.id === id ? previousNotebook : nb)));
      }
      setError('Failed to rename notebook.');
      console.error(writeError);
    });
  }, [userId, notebooks]);

  const deleteNotebook = useCallback((id) => {
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault || !userId) return false;
    const removedNotebook = notebooks.find((nb) => nb.id === id);
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
    setError(null);

    if (isDemoMode) return true;

    deleteDoc(notebookRef(userId, id)).catch((writeError) => {
      if (removedNotebook) {
        setNotebooks((prev) => [...prev, removedNotebook]);
      }
      setError('Failed to delete notebook.');
      console.error(writeError);
    });
    return true;
  }, [userId, notebooks]);

  const moveNotebookCategory = useCallback((id, newParaCategory) => {
    if (!userId) return;
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault) return;
    const paraCat = DEFAULT_PARA_CATEGORIES.find((c) => c.id === newParaCategory);
    if (!paraCat) return;
    const previousNotebook = notebooks.find((nb) => nb.id === id);
    const updates = { paraCategory: newParaCategory, color: paraCat.color, icon: paraCat.icon };
    setNotebooks((prev) => prev.map((nb) => (nb.id === id ? { ...nb, ...updates } : nb)));
    setError(null);

    if (isDemoMode) return;

    updateDoc(notebookRef(userId, id), updates).catch((writeError) => {
      if (previousNotebook) {
        setNotebooks((prev) => prev.map((nb) => (nb.id === id ? previousNotebook : nb)));
      }
      setError('Failed to move notebook category.');
      console.error(writeError);
    });
  }, [userId, notebooks]);

  const getNotebooksByCategory = useCallback(
    (paraCategory) => notebooks.filter((nb) => nb.paraCategory === paraCategory),
    [notebooks]
  );

  return {
    notebooks,
    loading,
    error,
    clearError: () => setError(null),
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
    getNotebooksByCategory,
  };
}
