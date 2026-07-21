import { FileText, FlaskConical, ScrollText, Download, MapPin, Clock, Users, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Note, Book, Ride } from "@/lib/mock-data";

function priceLabel(price: number) {
  return price === 0 ? "FREE" : `₹${price}`;
}

const noteIcon = {
  Notes: FileText,
  "Lab Manual": FlaskConical,
  "Past Paper": ScrollText,
} as const;

export function NoteCard({ note, className }: { note: Note; className?: string }) {
  const Icon = noteIcon[note.type];
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 font-bold",
            note.price === 0
              ? "bg-success/15 text-success-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {priceLabel(note.price)}
        </Badge>
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-foreground">
        {note.title}
      </h3>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium text-foreground">
          {note.subject}
        </span>
        <span>· {note.type}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">by {note.author}</p>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Download className="h-3 w-3" />
        {note.downloads} accessed · {note.pages} pages
      </div>
      <Button
        size="sm"
        className="mt-3 w-full"
        onClick={() => toast.success("Access requested", { description: note.title })}
      >
        Request Access
      </Button>
    </article>
  );
}

const conditionStyles = {
  New: "bg-success/15 text-success-foreground",
  Used: "bg-warning/20 text-warning-foreground",
} as const;

export function BookCard({ book, onChat }: { book: Book; onChat: (book: Book) => void }) {
  return (
    <article className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-secondary text-3xl">
        {book.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
            {book.title}
          </h3>
          <span className="shrink-0 font-display text-sm font-extrabold text-primary">
            {priceLabel(book.price)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className={cn("font-bold", conditionStyles[book.condition])}>
            {book.condition}
          </Badge>
          <span className="text-[11px] text-muted-foreground">{book.category}</span>
          {book.rentalDuration && (
            <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
              {book.rentalDuration}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 text-accent" />
          {book.seller} · {book.distanceKm} km away
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => onChat(book)}
        >
          <ArrowLeftRight className="h-4 w-4" />
          Chat with Seller to Swap
        </Button>
      </div>
    </article>
  );
}

export function RideCard({ ride }: { ride: Ride }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="bg-secondary font-bold text-secondary-foreground">
          {ride.mode}
        </Badge>
        <span className="font-display text-sm font-extrabold text-primary">
          {ride.costPerHead === 0 ? "Free" : `₹${ride.costPerHead}/head`}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div className="flex flex-col items-center pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="my-0.5 h-7 w-px bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{ride.origin}</p>
          <p className="mt-4 truncate text-sm font-semibold text-foreground">{ride.destination}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-accent" />
          {ride.time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-accent" />
          {ride.seats} seat{ride.seats > 1 ? "s" : ""} left
        </span>
        <span>Host: {ride.host}</span>
      </div>

      <Button
        size="sm"
        className="mt-3 w-full"
        onClick={() =>
          toast.success("You've joined the pool!", {
            description: `${ride.origin} → ${ride.destination} at ${ride.time}`,
          })
        }
      >
        Join Pool
      </Button>
    </article>
  );
}
