import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Building2, GraduationCap, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useProfile } from "@/hooks/use-profile";
import { STATES, UNIVERSITIES, COLLEGES, DEPARTMENTS } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { ready, profile, update } = useProfile();
  const [state, setState] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (ready && !profile) navigate({ to: "/auth" });
    if (ready && profile?.college) navigate({ to: "/" });
  }, [ready, profile, navigate]);

  const complete = state && university && college && department;

  const onFinish = () => {
    update({ state, university, college, department });
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
        <SelectField
          label="State"
          icon={<MapPin className="h-4 w-4 text-accent" />}
          placeholder="Select your state"
          value={state}
          onChange={setState}
          options={STATES}
        />
        <SelectField
          label="University / Board"
          icon={<Building2 className="h-4 w-4 text-accent" />}
          placeholder="Select university or board"
          value={university}
          onChange={setUniversity}
          options={UNIVERSITIES}
        />
        <SelectField
          label="College / School"
          icon={<GraduationCap className="h-4 w-4 text-accent" />}
          placeholder="Select your institution"
          value={college}
          onChange={setCollege}
          options={COLLEGES}
        />
        <SelectField
          label="Department / Stream"
          icon={<BookOpen className="h-4 w-4 text-accent" />}
          placeholder="Select your branch"
          value={department}
          onChange={setDepartment}
          options={DEPARTMENTS}
        />
      </div>

      <Button
        size="lg"
        className="mt-10 w-full"
        disabled={!complete}
        onClick={onFinish}
      >
        <Check className="h-4 w-4" />
        Enter CampuShare
      </Button>
    </div>
  );
}

function SelectField({
  label,
  icon,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold">
        {icon}
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
