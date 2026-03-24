import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateId } from '../utils';
import { isDemoMode } from '../runtime';

const demoRefsKey = (userId) => `noto-demo-refs-${userId}`;

function refsCollection(userId) {
  return collection(db, 'users', userId, 'references');
}

function refDoc(userId, refId) {
  return doc(db, 'users', userId, 'references', refId);
}

/**
 * Hook for managing bibliographic references.
 * Mirrors the useNotes pattern: real-time Firestore sync in production,
 * localStorage persistence in demo mode.
 */
export function useReferences(userId) {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ── Real-time sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      const t = setTimeout(() => {
        setReferences([]);
        setLoading(false);
        setSaving(false);
        setError(null);
      }, 0);
      return () => clearTimeout(t);
    }

    if (isDemoMode) {
      const t = setTimeout(() => {
        setLoading(true);
        let existing = [];
        try {
          existing = JSON.parse(localStorage.getItem(demoRefsKey(userId)) || '[]');
        } catch {
          existing = [];
        }
        setReferences(existing);
        setLoading(false);
      }, 0);
      return () => clearTimeout(t);
    }

    const startSyncTimer = setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    const q = query(refsCollection(userId), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setReferences(snap.docs.map((d) => d.data()));
        setLoading(false);
      },
      (err) => {
        setError('Failed to sync references. Please refresh.');
        setLoading(false);
        console.error(err);
      },
    );
    return () => {
      clearTimeout(startSyncTimer);
      unsubscribe();
    };
  }, [userId]);

  // ── Demo-mode persistence ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isDemoMode || !userId || loading) return;
    try {
      localStorage.setItem(demoRefsKey(userId), JSON.stringify(references));
    } catch {
      console.error('Failed to persist demo references.');
    }
  }, [references, userId, loading]);

  // ── Write helper ────────────────────────────────────────────────────────────
  const trackWrite = useCallback((promise) => {
    setSaving(true);
    setError(null);
    promise
      .catch((e) => {
        setError('Failed to save reference.');
        console.error(e);
      })
      .finally(() => setSaving(false));
  }, []);

  // ── CRUD actions ────────────────────────────────────────────────────────────

  const createReference = useCallback(
    (fields = {}) => {
      if (!userId) return null;
      const now = new Date().toISOString();
      const ref = {
        id: generateId(),
        type: 'article',
        title: '',
        authors: [],
        year: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        publisher: '',
        location: '',
        edition: '',
        conference: '',
        editors: [],
        institution: '',
        degree: '',
        url: '',
        accessDate: '',
        websiteName: '',
        abstract: '',
        notes: '',
        tags: [],
        createdAt: now,
        updatedAt: now,
        ...fields,
      };

      setReferences((prev) => [ref, ...prev]);

      if (!isDemoMode) {
        trackWrite(setDoc(refDoc(userId, ref.id), ref));
      }
      return ref;
    },
    [userId, trackWrite],
  );

  const updateReference = useCallback(
    (id, changes) => {
      if (!userId) return;
      const now = new Date().toISOString();
      const patch = { ...changes, updatedAt: now };

      setReferences((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );

      if (!isDemoMode) {
        trackWrite(updateDoc(refDoc(userId, id), patch));
      }
    },
    [userId, trackWrite],
  );

  const deleteReference = useCallback(
    (id) => {
      if (!userId) return;
      setReferences((prev) => prev.filter((r) => r.id !== id));
      if (!isDemoMode) {
        trackWrite(deleteDoc(refDoc(userId, id)));
      }
    },
    [userId, trackWrite],
  );

  // ── Derived ─────────────────────────────────────────────────────────────────

  const allRefTags = useMemo(
    () => [...new Set(references.flatMap((r) => r.tags || []))].sort(),
    [references],
  );

  const searchReferences = useCallback(
    (query = '') => {
      if (!query.trim()) return references;
      const q = query.toLowerCase();
      return references.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          (r.authors || []).some((a) => a.toLowerCase().includes(q)) ||
          r.journal?.toLowerCase().includes(q) ||
          r.year?.includes(q) ||
          (r.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    },
    [references],
  );

  return {
    references,
    loading,
    saving,
    error,
    allRefTags,
    createReference,
    updateReference,
    deleteReference,
    searchReferences,
  };
}
