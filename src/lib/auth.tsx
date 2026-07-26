"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AppRole, ProfileRow } from "@/lib/database.types";

type AuthState = {
  /** null while the session is still being restored from storage. */
  loading: boolean;
  session: Session | null;
  profile: ProfileRow | null;
  role: AppRole | null;
  configured: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    // RLS restricts this to the caller's own row, so no filter is needed for
    // safety; maybeSingle keeps a missing profile from throwing.
    const { data } = await getSupabase()
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      if (active) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        await loadProfile(nextSession?.user.id);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await getSupabase().auth.signOut();
    }
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(session?.user.id);
  }, [loadProfile, session?.user.id]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      profile,
      role: profile?.role ?? null,
      configured: isSupabaseConfigured,
      signOut,
      refreshProfile,
    }),
    [loading, session, profile, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

type GuardResult = AuthState & {
  /** True once the session is loaded and the role requirement is satisfied. */
  allowed: boolean;
};

/**
 * Redirects an unauthenticated or under-privileged visitor away from a portal
 * page.
 *
 * This is a usability guard, not a security control. The bundle is static and
 * fully readable, so access is actually enforced by RLS in Postgres: an
 * unauthorised session that reached this page anyway would render empty. See
 * supabase/migrations/0002_rls_policies.sql.
 */
export function useRequireAuth(requiredRole?: AppRole): GuardResult {
  const auth = useAuth();
  const router = useRouter();
  const { loading, session, role, configured } = auth;

  useEffect(() => {
    if (!configured || loading) return;

    if (!session) {
      router.replace("/dashboard/login");
      return;
    }

    if (requiredRole === "admin" && role !== "admin") {
      router.replace("/dashboard");
    }
  }, [configured, loading, session, role, requiredRole, router]);

  const allowed =
    Boolean(session) && (requiredRole ? role === requiredRole : true);

  return { ...auth, allowed };
}
