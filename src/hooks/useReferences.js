import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { isDemoMode } from '../runtime';
import { generateId } from '../utils';

const demoRefsKey = (userId) => `noto-demo-refs-${userId}`;

function refsCollection(userId) {
  return collection(db, 'users', userId, 'references');
}

function refDoc(userId, refId) {
  return doc(db, 'users', userId, 'references', refId);
}

/**
 * useReferences — CRUD hook for managing academic references.
 * Works with both Firebase Firestore and localStorage (demo mode).
 *
 * @param {string|null|undefined} userId - Current authenticated user ID
 * @returns {Object} references, loading, error, and CRUD actions
 */
export function useReferences(userId) {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Load references ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      const timer = setTimeout(() => {
        setReferences([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (isDemoMode) {
      const timer = setTimeout(() => {
        setLoading(true);
        try {
          const stored = JSON.parse(localStorage.getItem(demoRefsKey(userId)) || '[]');
          setReferences(stored);
        } catch {
          setReferences([]);
        }
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const startTimer = setTimeout(() => {
      setLoading(true);
    }, 0);
    const refsQuery = query(refsCollection(userId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      refsQuery,
      (snap) => {
        setReferences(snap.docs.map((d) => d.data()));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Failed to load references:', err);
        setError('Failed to load references.');
        setLoading(false);
      },
    );
    return () => {
      clearTimeout(startTimer);
      unsubscribe();
    };
  }, [userId]);

  // ── Persist demo references ──────────────────────────────────────────────────
  const _saveDemo = useCallback(
    (updated) => {
      if (!userId) return;
      localStorage.setItem(demoRefsKey(userId), JSON.stringify(updated));
    },
    [userId],
  );

  // ── Create ───────────────────────────────────────────────────────────────────
  const createReference = useCallback(
    (data) => {
      if (!userId) return null;
      const now = new Date().toISOString();
      const newRef = {
        id: generateId(),
        type: 'journal',
        authors: [],
        title: '',
        year: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        publisher: '',
        location: '',
        url: '',
        accessed: '',
        conference: '',
        editors: [],
        ...data,
        createdAt: now,
        updatedAt: now,
        userId,
      };

      if (isDemoMode) {
        const updated = [newRef, ...references];
        setReferences(updated);
        _saveDemo(updated);
      } else {
        setDoc(refDoc(userId, newRef.id), newRef).catch((err) => {
          console.error('Failed to create reference:', err);
          setError('Failed to create reference.');
        });
      }

      return newRef;
    },
    [userId, references, _saveDemo],
  );

  // ── Update ───────────────────────────────────────────────────────────────────
  const updateReference = useCallback(
    (id, changes) => {
      if (!userId) return;
      const now = new Date().toISOString();
      const patch = { ...changes, updatedAt: now };

      if (isDemoMode) {
        const updated = references.map((r) =>
          r.id === id ? { ...r, ...patch } : r,
        );
        setReferences(updated);
        _saveDemo(updated);
      } else {
        updateDoc(refDoc(userId, id), patch).catch((err) => {
          console.error('Failed to update reference:', err);
          setError('Failed to update reference.');
        });
      }
    },
    [userId, references, _saveDemo],
  );

  // ── Delete ───────────────────────────────────────────────────────────────────
  const deleteReference = useCallback(
    (id) => {
      if (!userId) return;

      if (isDemoMode) {
        const updated = references.filter((r) => r.id !== id);
        setReferences(updated);
        _saveDemo(updated);
      } else {
        deleteDoc(refDoc(userId, id)).catch((err) => {
          console.error('Failed to delete reference:', err);
          setError('Failed to delete reference.');
        });
      }
    },
    [userId, references, _saveDemo],
  );

  return {
    references,
    loading,
    error,
    createReference,
    updateReference,
    deleteReference,
  };
}
