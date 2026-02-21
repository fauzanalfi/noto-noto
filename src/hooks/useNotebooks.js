import { useState, useCallback, useEffect } from 'react';
import { generateId, DEFAULT_PARA_CATEGORIES } from '../utils';

const STORAGE_KEY = 'noto-notebooks';

function loadNotebooks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load notebooks', e);
  }
  // Initialize with PARA categories as default notebooks
  return DEFAULT_PARA_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
    paraCategory: cat.id,
    createdAt: new Date().toISOString(),
  }));
}

function saveNotebooks(notebooks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
}

export function useNotebooks() {
  const [notebooks, setNotebooks] = useState(loadNotebooks);

  useEffect(() => {
    saveNotebooks(notebooks);
  }, [notebooks]);

  const createNotebook = useCallback((name, paraCategory = 'resources') => {
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
    return nb;
  }, []);

  const renameNotebook = useCallback((id, name) => {
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === id ? { ...nb, name } : nb))
    );
  }, []);

  const deleteNotebook = useCallback((id) => {
    // Don't allow deleting default PARA notebooks
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault) return false;
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
    return true;
  }, []);

  const moveNotebookCategory = useCallback((id, newParaCategory) => {
    const paraCat = DEFAULT_PARA_CATEGORIES.find((c) => c.id === newParaCategory);
    if (!paraCat) return;
    // Don't allow moving default PARA notebooks
    const isDefault = DEFAULT_PARA_CATEGORIES.some((c) => c.id === id);
    if (isDefault) return;
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === id
          ? { ...nb, paraCategory: newParaCategory, color: paraCat.color, icon: paraCat.icon }
          : nb
      )
    );
  }, []);

  const getNotebooksByCategory = useCallback(
    (paraCategory) => {
      return notebooks.filter((nb) => nb.paraCategory === paraCategory);
    },
    [notebooks]
  );

  return {
    notebooks,
    createNotebook,
    renameNotebook,
    deleteNotebook,
    moveNotebookCategory,
    getNotebooksByCategory,
  };
}
