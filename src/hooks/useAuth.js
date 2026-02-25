import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { isDemoMode } from '../runtime';

const DEMO_USER_KEY = 'noto-demo-user';

const defaultDemoUser = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@noto.local',
  photoURL: null,
};

export function useAuth() {
  // undefined = still loading, null = not signed in, object = signed in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (isDemoMode) {
      const demoAuthTimer = setTimeout(() => {
      try {
        const savedUser = localStorage.getItem(DEMO_USER_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemoUser));
          setUser(defaultDemoUser);
        }
      } catch {
        setUser(defaultDemoUser);
      }
      }, 0);
      return () => clearTimeout(demoAuthTimer);
    }

    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  const signIn = () => {
    if (isDemoMode) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemoUser));
      setUser(defaultDemoUser);
      return Promise.resolve(defaultDemoUser);
    }
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    if (isDemoMode) {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  return { user, signIn, signOut: signOutUser };
}
