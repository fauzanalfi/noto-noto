import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export function useAuth() {
  // undefined = still loading, null = not signed in, object = signed in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  const signIn = () => signInWithPopup(auth, googleProvider);
  const signOutUser = () => signOut(auth);

  return { user, signIn, signOut: signOutUser };
}
