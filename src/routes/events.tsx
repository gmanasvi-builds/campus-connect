import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Plus, Users, HandHeart, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Campus Events — CampuShare" },
      { name: "description", content: "Discover, register for, and volunteer at campus events near you." },
      { property: "og:title", content: "Campus Events — CampuShare" },
      { property: "og:description", content: "Discover, register for, and volunteer at campus events near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventsPage,
});

import { EVENT_CATEGORIES, EVENT_EMOJI, EVENTS, formatEventDateTime, type CampusEvent, type CampusEventCategory } from "@/lib/mock-data";

type Category = CampusEventCategory;



function EventsPage() {
  const [events, setEvents] = useState<CampusEvent[]>(SEED);
  const [tab, setTab] = useState<"participate" | "volunteer">("participate");
  const [createOpen, setCreateOpen] = useState(false);
  const [registerFor, setRegisterFor] = useState<CampusEvent | null>(null);
  const [volunteerFor, setVolunteerFor] = useState<CampusEvent | null>(null);

  const list = events.filter((e) => (tab === "participate" ? e.participation : e.volunteering));

  return (
    <AppLayout>
      <PageHeader title="Campus Events" subtitle="Participate, volunteer & host events" />

      <div className="space-y-4 px-5 pt-4">
        <Button className="w-full" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Create Event
        </Button>

        <div className="flex rounded-xl bg-secondary p-1">
          {(["participate", "volunteer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold capitalize transition-colors",
                tab === t ? "bg-card text-primary shadow-card" : "text-muted-foreground",
              )}
            >
              {t === "participate" ? <Users className="h-4 w-4" /> : <HandHeart className="h-4 w-4" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="space-y-3 px-5 py-4">
        {list.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No events here yet. Create one!
          </p>
        )}
        {list.map((e) =>
          tab === "participate" ? (
            <article key={e.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="gradient-hero flex items-center gap-3 px-4 py-4 text-primary-foreground">
                <span className="text-3xl">{EMOJI[e.category]}</span>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-bold leading-snug">{e.title}</h3>
                  <span className="text-xs text-primary-foreground/80">{e.category} · {e.participantMode === "Both" ? "Solo or Team" : e.participantMode}</span>
                </div>
              </div>
              <div className="space-y-1.5 p-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-accent" />{fmt(e.dateTime)}</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />{e.venue}</p>
                <Button size="sm" className="mt-2 w-full" onClick={() => setRegisterFor(e)}>Register / Join</Button>
              </div>
            </article>
          ) : (
            <article key={e.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-foreground">{e.title}</h3>
                <Badge variant="secondary" className="shrink-0 font-bold">{e.volunteersNeeded} needed</Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5 text-accent" />{fmt(e.dateTime)} · {e.venue}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.roles.map((r) => <span key={r} className="rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">{r}</span>)}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {e.slots.map((s) => <span key={s} className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground"><Clock className="h-3 w-3" />{s}</span>)}
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setVolunteerFor(e)}>
                <HandHeart className="h-4 w-4" /> Sign Up to Volunteer
              </Button>
            </article>
          ),
        )}
      </main>

      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(ev) => {
          setEvents((l) => [ev, ...l]);
          toast.success("Event published!", { description: ev.title });
        }}
      />
      <RegisterDialog event={registerFor} onClose={() => setRegisterFor(null)} />
      <VolunteerDialog event={volunteerFor} onClose={() => setVolunteerFor(null)} />
    </AppLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg bg-secondary p-1">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={cn("flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors", value === o ? "bg-card shadow-card" : "text-muted-foreground")}>
          {o}
        </button>
      ))}
    </div>
  );
}

const splitList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function CreateEventDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (v: boolean) => void; onCreate: (e: CampusEvent) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState<Category>("Technical");
  const [participation, setParticipation] = useState(true);
  const [mode, setMode] = useState<"Individual" | "Team" | "Both">("Individual");
  const [teamSize, setTeamSize] = useState("4");
  const [volunteering, setVolunteering] = useState(false);
  const [needed, setNeeded] = useState("5");
  const [roles, setRoles] = useState("");
  const [slots, setSlots] = useState("");
  const [contact, setContact] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateTime || !venue.trim()) return toast.error("Title, date and venue are required");
    if (!participation && !volunteering) return toast.error("Enable registration or volunteer sign-up");
    onCreate({
      id: `ev-${Date.now()}`, title: title.trim().slice(0, 120), description: description.trim().slice(0, 1000), dateTime, venue: venue.trim().slice(0, 120), category,
      participation, participantMode: mode, maxTeamSize: Math.max(1, Number(teamSize) || 1),
      volunteering, volunteersNeeded: Math.max(0, Number(needed) || 0), roles: splitList(roles), slots: splitList(slots), contact: contact.trim(),
    });
    setTitle(""); setDescription(""); setDateTime(""); setVenue(""); setRoles(""); setSlots(""); setContact("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-sm overflow-y-auto">
        <DialogHeader><DialogTitle>Create an event</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Event title"><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Code Sprint 2026" /></Field>
          <Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} rows={3} placeholder="What's it about?" /></Field>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Date & time"><Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} /></Field>
            <Field label="Location / Venue"><Input value={venue} onChange={(e) => setVenue(e.target.value)} maxLength={120} placeholder="e.g. Seminar Hall A" /></Field>
          </div>
          <Field label="Category">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)}
                  className={cn("rounded-full border px-3 py-1 text-xs font-semibold", category === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>
                  {EMOJI[c]} {c}
                </button>
              ))}
            </div>
          </Field>

          <div className="space-y-3 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between"><Label className="text-sm font-semibold">Participant registration</Label><Switch checked={participation} onCheckedChange={setParticipation} /></div>
            {participation && (
              <>
                <Field label="Participation type"><Segmented value={mode} options={["Individual", "Team", "Both"] as const} onChange={setMode} /></Field>
                {mode !== "Individual" && <Field label="Max team size"><Input type="number" min="2" max="50" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} /></Field>}
              </>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between"><Label className="text-sm font-semibold">Volunteer sign-up</Label><Switch checked={volunteering} onCheckedChange={setVolunteering} /></div>
            {volunteering && (
              <>
                <Field label="Volunteers needed"><Input type="number" min="1" value={needed} onChange={(e) => setNeeded(e.target.value)} /></Field>
                <Field label="Roles (comma separated)"><Input value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="Registration, Stage crew" /></Field>
                <Field label="Time slots (comma separated)"><Input value={slots} onChange={(e) => setSlots(e.target.value)} placeholder="9–12 AM, 12–3 PM" /></Field>
                <Field label="Coordinator contact"><Input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="Email or phone" /></Field>
              </>
            )}
          </div>

          <DialogFooter><Button type="submit" className="w-full">Publish Event</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RegisterDialog({ event, onClose }: { event: CampusEvent | null; onClose: () => void }) {
  const [as, setAs] = useState<"Individual" | "Group/Team">("Individual");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [members, setMembers] = useState("");
  const allowed = event?.participantMode === "Both" ? (["Individual", "Group/Team"] as const) : event?.participantMode === "Team" ? (["Group/Team"] as const) : (["Individual"] as const);
  const effective = (allowed as readonly string[]).includes(as) ? as : allowed[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effective === "Individual" && !name.trim()) return toast.error("Enter your name");
    if (effective === "Group/Team") {
      if (!team.trim()) return toast.error("Enter a team name");
      const m = splitList(members);
      if (m.length === 0) return toast.error("Add team members");
      if (event && m.length > event.maxTeamSize) return toast.error(`Max team size is ${event.maxTeamSize}`);
    }
    toast.success("Registered!", { description: `${event?.title} · ${effective === "Individual" ? name : team}` });
    setName(""); setTeam(""); setMembers(""); onClose();
  };

  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Register for {event?.title}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Registering as"><Segmented value={effective as "Individual" | "Group/Team"} options={allowed} onChange={setAs} /></Field>
          {effective === "Individual" ? (
            <Field label="Your name / Roll no."><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></Field>
          ) : (
            <>
              <Field label="Team name"><Input value={team} onChange={(e) => setTeam(e.target.value)} maxLength={80} /></Field>
              <Field label={`Members' names / IDs (comma separated, max ${event?.maxTeamSize})`}>
                <Textarea value={members} onChange={(e) => setMembers(e.target.value)} rows={3} maxLength={800} placeholder="Aarav 21CS001, Sneha 21CS045" />
              </Field>
            </>
          )}
          <DialogFooter><Button type="submit" className="w-full">Confirm Registration</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function VolunteerDialog({ event, onClose }: { event: CampusEvent | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("");
  const [slot, setSlot] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return toast.error("Name and contact are required");
    toast.success("You're signed up to volunteer!", { description: `${event?.title}${role ? ` · ${role}` : ""}` });
    setName(""); setContact(""); setRole(""); setSlot(""); onClose();
  };

  const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Volunteer: {event?.title}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Your name"><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></Field>
          <Field label="Contact (phone or email)"><Input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} /></Field>
          <Field label="Preferred role">
            <select className={sel} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Any role</option>
              {event?.roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Preferred slot">
            <select className={sel} value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="">Any slot</option>
              {event?.slots.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <DialogFooter><Button type="submit" className="w-full">Sign Up</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
