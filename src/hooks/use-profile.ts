import { useCallback, useEffect, useState } from "react";

export type Profile = {
  name: string;
  email: string;
  state: string;
  university: string;
  college: string;
  department: string;
};

const KEY = "campushare:profile";

function read(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

/**
 * Lightweight mock auth/profile store backed by localStorage.
 * No backend — purely to simulate the onboarding + session flow.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(read());
    setReady(true);
    const onStorage = () => setProfile(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: Profile) => {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setProfile(next);
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    const current = read();
    if (!current) return;
    const next = { ...current, ...patch };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setProfile(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(KEY);
    setProfile(null);
  }, []);

  return { profile, ready, save, update, logout, isOnboarded: !!profile?.college };
}
