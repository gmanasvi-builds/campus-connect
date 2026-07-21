import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { BookCard } from "@/components/cards";
import { ChatDialog } from "@/components/ChatDialog";
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
import { BOOKS, RENTAL_DURATIONS, type Book, type RentalDuration } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "Book Bazaar — CampuShare" },
      { name: "description", content: "Buy, sell, and swap textbooks, drafters, and lab gear near campus." },
    ],
  }),
  component: BooksPage,
});

const EMOJIS = ["📘", "📐", "🥼", "📕", "🧮", "🎒", "📗", "✏️"];

function BooksPage() {
  const [listed, setListed] = useState<Book[]>([]);
  const [chatBook, setChatBook] = useState<Book | null>(null);
  const [open, setOpen] = useState(false);

  const books = [...listed, ...BOOKS];

  return (
    <AppLayout>
      <PageHeader title="Book Bazaar" subtitle="Textbooks, drafters & lab gear near you" />

      <div className="flex items-center gap-1.5 px-5 pt-4 text-xs font-medium text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-accent" />
        Showing items within 3 km of your campus
      </div>

      <main className="space-y-3 px-5 py-4">
        {books.map((b) => (
          <BookCard key={b.id} book={b} onChat={setChatBook} />
        ))}
      </main>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full gradient-hero px-5 py-3 text-sm font-bold text-primary-foreground shadow-float"
      >
        <Plus className="h-4 w-4" />
        Post an Item
      </button>

      <ChatDialog book={chatBook} onOpenChange={(o) => !o && setChatBook(null)} />

      <PostDialog
        open={open}
        onOpenChange={setOpen}
        onPost={(book) => {
          setListed((l) => [book, ...l]);
          toast.success("Item posted!", { description: book.title });
        }}
      />
    </AppLayout>
  );
}

function PostDialog({
  open,
  onOpenChange,
  onPost,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPost: (book: Book) => void;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<Book["condition"]>("Used");
  const [emoji, setEmoji] = useState("📘");

  const reset = () => {
    setTitle("");
    setPrice("");
    setCondition("Used");
    setEmoji("📘");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onPost({
      id: `bk-${Date.now()}`,
      title,
      category: "Listing",
      condition,
      price: Number(price) || 0,
      seller: "You",
      distanceKm: 0,
      emoji,
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
          <DialogTitle>Post an item</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 py-5">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-secondary text-4xl">
              {emoji}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ImagePlus className="h-3.5 w-3.5" /> Pick a cover
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg text-lg",
                    emoji === e ? "bg-primary/15 ring-2 ring-primary" : "bg-card",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Item title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mini Drafter (barely used)" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Price (₹)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Condition</Label>
              <div className="flex rounded-lg bg-secondary p-1">
                {(["New", "Used"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors",
                      condition === c ? "bg-card shadow-card" : "text-muted-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">List item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
