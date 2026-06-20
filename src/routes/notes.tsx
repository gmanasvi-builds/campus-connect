import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Upload, FileUp, X } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { NoteCard } from "@/components/cards";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NOTES, SUBJECTS, type Note } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes Marketplace — CampuShare" },
      { name: "description", content: "Browse and upload PDF notes, lab manuals, and past papers." },
    ],
  }),
  component: NotesPage,
});

const TYPES = ["All", "Notes", "Lab Manual", "Past Paper"] as const;

function NotesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [uploaded, setUploaded] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  const all = [...uploaded, ...NOTES];
  const filtered = useMemo(() => {
    return all.filter((n) => {
      const matchesType = type === "All" || n.type === type;
      const matchesQuery =
        !query ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.subject.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [all, type, query]);

  return (
    <AppLayout>
      <PageHeader
        title="Notes Marketplace"
        subtitle="PDF notes, lab manuals & solved papers"
      />

      <div className="sticky top-0 z-20 space-y-3 bg-background/95 px-5 pb-3 pt-3 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or subject…"
            className="pl-9"
          />
        </div>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                type === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="grid grid-cols-2 gap-3 px-5 py-4">
        {filtered.map((n) => (
          <NoteCard key={n.id} note={n} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-12 text-center text-sm text-muted-foreground">
            No matching notes. Be the first to upload!
          </p>
        )}
      </main>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full gradient-hero px-5 py-3 text-sm font-bold text-primary-foreground shadow-float"
      >
        <Plus className="h-4 w-4" />
        Upload Note
      </button>

      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        onUpload={(note) => {
          setUploaded((u) => [note, ...u]);
          toast.success("Note uploaded!", { description: note.title });
        }}
      />
    </AppLayout>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpload: (note: Note) => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<Note["type"]>("Notes");
  const [price, setPrice] = useState("0");
  const [fileName, setFileName] = useState("");

  const reset = () => {
    setTitle("");
    setSubject("");
    setType("Notes");
    setPrice("0");
    setFileName("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;
    onUpload({
      id: `up-${Date.now()}`,
      title,
      subject,
      type,
      price: Number(price) || 0,
      author: "You",
      pages: Math.floor(Math.random() * 40) + 10,
      downloads: 0,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Upload a note</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 py-6 text-center transition-colors hover:border-primary">
            {fileName ? (
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileUp className="h-4 w-4 text-primary" />
                {fileName}
                <X
                  className="h-3.5 w-3.5 text-muted-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    setFileName("");
                  }}
                />
              </span>
            ) : (
              <>
                <Upload className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Tap to attach PDF</span>
                <span className="text-xs text-muted-foreground">Max 25 MB</span>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "study-notes.pdf")}
            />
          </label>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Document title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Unit 3 — Trees & Graphs" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Note["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Notes">Notes</SelectItem>
                  <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                  <SelectItem value="Past Paper">Past Paper</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Price (₹) — set 0 to share free</Label>
            <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">Publish note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
