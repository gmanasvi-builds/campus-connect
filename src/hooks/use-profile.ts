import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  state: string | null;
  university: string | null;
  college: string | null;
  department: string | null;
};

const PROFILE_COLUMNS = "id,name,email,state,university,college,department";

/**
 * Real auth + profile store backed by Lovable Cloud.
 * Tracks the signed-in user and their profile row, and exposes helpers
 * to persist onboarding details. Profile completion is gated on `college`.
 */
export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", uid)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    // Keep local state in sync with auth changes (login, logout, refresh).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        // Defer the Supabase call out of the auth callback.
        setTimeout(() => {
          if (active) loadProfile(u.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // Initial session load.
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) await loadProfile(u.id);
      if (active) setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (patch: Partial<Omit<Profile, "id">>) => {
      if (!user) return { error: new Error("Not authenticated") };
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...patch })
        .select(PROFILE_COLUMNS)
        .maybeSingle();
      if (!error && data) setProfile(data as Profile);
      return { error };
    },
    [user],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return {
    user,
    profile,
    ready,
    isAuthenticated: !!user,
    isOnboarded: !!profile?.college,
    saveProfile,
    update: saveProfile,
    logout,
  };
}
