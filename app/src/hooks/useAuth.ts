import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, UserProfile } from '../services/auth';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: true });
  const userRef = useRef<User | null>(null);

  const loadProfile = async (u: User) => {
    const profile = await getUserProfile(u.uid);
    setState({ user: u, profile, loading: false });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      userRef.current = u;
      if (u) {
        await loadProfile(u);
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });
    return unsub;
  }, []);

  const refreshProfile = async () => {
    if (userRef.current) await loadProfile(userRef.current);
  };

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
