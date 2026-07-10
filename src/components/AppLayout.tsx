import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { useProfile } from "@/hooks/use-profile";

/**
 * App shell for the authenticated experience: constrains to a mobile-width
 * column, renders the page, and pins the bottom navigation bar.
 * Enforces two gates before rendering:
 *  1. Must be signed in  -> redirect to /auth
 *  2. Must have completed onboarding -> redirect to /onboarding
 */
export function AppLayout({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, isOnboarded } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      navigate({ to: "/auth" });
    } else if (!isOnboarded) {
      navigate({ to: "/onboarding" });
    }
  }, [ready, isAuthenticated, isOnboarded, navigate]);

  if (!ready || !isAuthenticated || !isOnboarded) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
