import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CampuShare" },
      { name: "description", content: "Log in or create your CampuShare account to start sharing." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { ready, isOnboarded, save, profile } = useProfile();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (ready && isOnboarded) navigate({ to: "/" });
  }, [ready, isOnboarded, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth: persist a partial profile, then finish onboarding.
    save({
      name: name || profile?.name || "Student",
      email: email || profile?.email || "",
      state: "",
      university: "",
      college: "",
      department: "",
    });
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="gradient-hero relative overflow-hidden px-6 pb-10 pt-14 text-primary-foreground">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
        <Logo className="[&_span]:text-primary-foreground" />
        <h1 className="mt-8 text-3xl font-extrabold leading-tight">
          Your campus,
          <br />
          shared.
        </h1>
        <p className="mt-2 max-w-xs text-sm text-primary-foreground/85">
          Swap notes, rent books, and pool rides with students right next to you.
        </p>
      </div>

      <div className="flex-1 px-6 pt-6">
        <div className="mb-5 flex rounded-xl bg-secondary p-1">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors " +
                (mode === m
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground")
              }
            >
              {m === "signup" ? "Create account" : "Log in"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <Field label="Full name" icon={<UserIcon className="h-4 w-4" />}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="pl-9"
                required
              />
            </Field>
          )}
          <Field label="College email" icon={<Mail className="h-4 w-4" />}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="pl-9"
              required
            />
          </Field>
          <Field label="Password" icon={<Lock className="h-4 w-4" />}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
              required
            />
          </Field>

          <Button type="submit" size="lg" className="mt-2 w-full">
            {mode === "signup" ? "Continue" : "Log in"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to CampuShare's community guidelines.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
