import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Building2, GraduationCap, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your profile — CampuShare" },
      { name: "description", content: "Tell us your campus so we can show hyper-local listings." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { ready, isAuthenticated, profile, saveProfile } = useProfile();
  const [state, setState] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) navigate({ to: "/auth" });
    else if (profile?.college) navigate({ to: "/" });
  }, [ready, isAuthenticated, profile, navigate]);

  // Pre-fill any details already stored on the profile.
  useEffect(() => {
    if (!profile) return;
    setState((s) => s || profile.state || "");
    setUniversity((u) => u || profile.university || "");
    setCollege((c) => c || profile.college || "");
    setDepartment((d) => d || profile.department || "");
  }, [profile]);

  const complete =
    state.trim() && university.trim() && college.trim() && department.trim();

  const onFinish = async () => {
    if (!complete || saving) return;
    setSaving(true);
    const { error } = await saveProfile({
      state: state.trim(),
      university: university.trim(),
      college: college.trim(),
      department: department.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error(error.message || "Couldn't save your profile");
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background px-6 pb-10 pt-12">
      <Logo />
      <h1 className="mt-8 text-2xl font-extrabold">Set up your campus</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        We use this to show notes, books, and rides near you.
      </p>

      <div className="mt-8 space-y-5">
        <TextField
          label="State"
          icon={<MapPin className="h-4 w-4 text-accent" />}
          placeholder="e.g. Telangana"
          value={state}
          onChange={setState}
          maxLength={80}
        />
        <TextField
          label="University / Board"
          icon={<Building2 className="h-4 w-4 text-accent" />}
          placeholder="e.g. Osmania University"
          value={university}
          onChange={setUniversity}
          maxLength={120}
        />
        <TextField
          label="College / School"
          icon={<GraduationCap className="h-4 w-4 text-accent" />}
          placeholder="e.g. University College of Engineering"
          value={college}
          onChange={setCollege}
          maxLength={120}
        />
        <TextField
          label="Department / Stream"
          icon={<BookOpen className="h-4 w-4 text-accent" />}
          placeholder="e.g. Computer Science"
          value={department}
          onChange={setDepartment}
          maxLength={80}
        />
      </div>

      <Button
        size="lg"
        className="mt-10 w-full"
        disabled={!complete || saving}
        onClick={onFinish}
      >
        <Check className="h-4 w-4" />
        {saving ? "Saving…" : "Enter CampuShare"}
      </Button>
    </div>
  );
}

function TextField({
  label,
  icon,
  placeholder,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold">
        {icon}
        {label}
      </Label>
      <Input
        className="h-11 w-full"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
