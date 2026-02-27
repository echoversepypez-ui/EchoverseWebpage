'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface ApplicantAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  /** Display name: full_name from signup, or email */
  displayName: string;
}

const ApplicantAuthContext = createContext<ApplicantAuthContextType | undefined>(undefined);

export function ApplicantAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string)?.trim() ||
    user?.email?.split('@')[0] ||
    user?.email ||
    '';

  return (
    <ApplicantAuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signOut,
        displayName,
      }}
    >
      {children}
    </ApplicantAuthContext.Provider>
  );
}

export function useApplicantAuth() {
  const ctx = useContext(ApplicantAuthContext);
  if (ctx === undefined) {
    throw new Error('useApplicantAuth must be used within ApplicantAuthProvider');
  }
  return ctx;
}
