import { useState, useCallback, useEffect } from 'react';
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateId, DEFAULT_PARA_CATEGORIES } from '../utils';

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

  useEffect(() => {
    if (!userId) { setNotebooks([]); setLoading(false); return; }
    setLoading(true);
    getDocs(notebooksRef(userId))
      .then((snap) => {
        if (snap.empty) {
          const defaults = defaultNotebooks();
          defaults.forEach((nb) =>
            setDoc(notebookRef(userId, nb.id), nb).catch(console.error)
          );
          setNotebooks(defaults);
        } else {
          setNotebooks(snap.docs.map((d) => d.data()));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

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
    setDoc(notebookRef(userId, nb.id), nb).catch(console.error);
    return nb;
  }, [userId]);

  const renameNotebook = useCallback((id, name) => {
    if (!userId) return;
    setNotebooks((prev) => prev.map((nb) => (nb.id === id ? { ...nb, name } : nb)));
    updateDoc(notebookRef(userId, id), { name }).catch(console.error);
  }, [userId]);

  const deleteNotebook = useCallback((id) => {
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault || !userId) return false;
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
    deleteDoc(notebookRef(userId, id)).catch(console.error);
    return true;
  }, [userId]);

  const moveNotebookCategory = useCallback((id, newParaCategory) => {
    if (!userId) return;
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault) return;
    const paraCat = DEFAULT_PARA_CATEGORIES.find((c) => c.id === newParaCategory);
    if (!paraCat) return;
    const updates = { paraCategory: newParaCategory, color: paraCat.color, icon: paraCat.icon };
    setNotebooks((prev) => prev.map((nb) => (nb.id === id ? { ...nb, ...updates } : nb)));
    updateDoc(notebookRef(userId, id), updates).catch(console.error);
  }, [userId]);

  const getNotebooksByCategory = useCallback(
    (paraCategory) => notebooks.filter((nb) => nb.paraCategory === paraCategory),
    [notebooks]
  );

  return {
    notebooks,
    loading,
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
    getNotebooksByCategory,
  };
}
