import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { supabase } from '../utils/supabase';
import api from '../utils/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase user
  const [dbUser, setDbUser] = useState(null);   // Prisma user
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const syncingRef = useRef(false);

  const syncWithBackend = async (supabaseSession) => {
    if (!supabaseSession) {
      setUser(null);
      setDbUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    // Prevent concurrent syncs
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${supabaseSession.access_token}` }
      });
      setUser(supabaseSession.user);
      setDbUser(data.user);
      setSession(supabaseSession);
    } catch (err) {
      // 403 = unverified email, 409 = duplicate account conflict
      // In both cases, sign out and clear state
      console.error('Backend sync failed:', err.response?.data?.error || err.message);
      await supabase.auth.signOut();
      setUser(null);
      setDbUser(null);
      setSession(null);
    } finally {
      syncingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // onAuthStateChange fires for: initial load, login, logout, OAuth callback, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Use setTimeout to avoid Supabase deadlock when calling API inside this callback
      setTimeout(() => syncWithBackend(session), 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // State cleared by onAuthStateChange → syncWithBackend(null)
  };

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, session, loading, signOut, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
