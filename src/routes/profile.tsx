import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  NotebookPen,
  ShoppingBag,
  Bus,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — CampuShare" },
      { name: "description", content: "Manage your campus profile, listings, and account." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, logout } = useProfile();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const initials =
    profile?.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  const onLogout = async () => {
    await logout();
    navigate({ to: "/auth" });
  };

  return (
    <AppLayout>
      <header className="gradient-hero rounded-b-3xl px-5 pb-8 pt-12 text-center text-primary-foreground">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-foreground/15 text-2xl font-extrabold ring-4 ring-primary-foreground/20">
          {initials}
        </div>
        <h1 className="mt-3 text-xl font-extrabold">{profile?.name}</h1>
        <p className="text-sm text-primary-foreground/80">{profile?.email || "No email set"}</p>
      </header>

      <div className="-mt-6 px-5">
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <Stat icon={<NotebookPen className="h-4 w-4" />} value="12" label="Notes" />
          <Stat icon={<ShoppingBag className="h-4 w-4" />} value="4" label="Listings" />
          <Stat icon={<Bus className="h-4 w-4" />} value="7" label="Rides" />
        </div>
      </div>

      <section className="px-5 py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">My campus</h2>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
        <div className="space-y-px overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <InfoRow icon={<MapPin className="h-4 w-4 text-accent" />} label="State" value={profile?.state ?? undefined} />
          <InfoRow icon={<Building2 className="h-4 w-4 text-accent" />} label="University / Board" value={profile?.university ?? undefined} />
          <InfoRow icon={<GraduationCap className="h-4 w-4 text-accent" />} label="College / School" value={profile?.college ?? undefined} />
          <InfoRow icon={<BookOpen className="h-4 w-4 text-accent" />} label="Department" value={profile?.department ?? undefined} />
        </div>
      </section>

      <section className="px-5 pb-6">
        <h2 className="mb-3 text-sm font-bold text-muted-foreground">Account</h2>
        <div className="space-y-px overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <LinkRow icon={<Settings className="h-4 w-4" />} label="Settings & preferences" />
          <LinkRow icon={<Shield className="h-4 w-4" />} label="Privacy & safety" />
          <LinkRow icon={<HelpCircle className="h-4 w-4" />} label="Help & support" />
        </div>
      </section>

      <div className="px-5 pb-8">
        <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">CampuShare · v1.0 · Made for students 🇮🇳</p>
      </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">CampuShare · v1.0 · Made for students 🇮🇳</p>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </AppLayout>
  );
}

function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { profile, update } = useProfile();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(profile?.name ?? "");
    setState(profile?.state ?? "");
    setUniversity(profile?.university ?? "");
    setCollege(profile?.college ?? "");
    setDepartment(profile?.department ?? "");
  }, [open, profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await update({
      name: name.trim() || null,
      state: state.trim() || null,
      university: university.trim() || null,
      college: college.trim() || null,
      department: department.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message || "Couldn't save changes");
      return;
    }
    toast.success("Profile updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
          <Field label="State" value={state} onChange={setState} placeholder="e.g. Telangana" />
          <Field label="University / Board" value={university} onChange={setUniversity} placeholder="e.g. Osmania University" />
          <Field label="College / School" value={college} onChange={setCollege} placeholder="e.g. UCE" />
          <Field label="Department / Stream" value={department} onChange={setDepartment} placeholder="e.g. Computer Science" />
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={120} />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary">{icon}</span>
      <span className="font-display text-lg font-extrabold leading-none text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value || "Not set"}</p>
      </div>
    </div>
  );
}

function LinkRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
