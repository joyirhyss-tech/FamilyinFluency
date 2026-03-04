import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

/**
 * Supabase Auth hook for super admin access.
 * Uses magic link (OTP) — no password needed.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session (handles magic link redirect callback too)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isSuperAdmin =
    !!session?.user?.email &&
    !!SUPER_ADMIN_EMAIL &&
    session.user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  /** Sign in with email and password. */
  const signInWithEmail = useCallback(async (email, password) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  /** Sign out and clear session. */
  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { session, loading, isSuperAdmin, signInWithEmail, signOut };
}
