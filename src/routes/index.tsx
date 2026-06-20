import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Bell, TrendingUp, NotebookPen, ShoppingBag, Bus, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Logo } from "@/components/Logo";
import { NoteCard, BookCard, RideCard } from "@/components/cards";
import { ChatDialog } from "@/components/ChatDialog";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { NOTES, BOOKS, RIDES, type Book } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampuShare — Campus Dashboard" },
      {
        name: "description",
        content: "Trending notes, books for rent, and campus rides near you.",
      },
    ],
  }),
  component: HomePage,
});

const FILTERS = [
  { to: "/notes", label: "Notes", icon: NotebookPen },
  { to: "/books", label: "Books", icon: ShoppingBag },
  { to: "/transit", label: "Transit", icon: Bus },
] as const;

function HomePage() {
  const { profile } = useProfile();
  const [chatBook, setChatBook] = useState<Book | null>(null);

  return (
    <AppLayout>
      <header className="gradient-hero rounded-b-3xl px-5 pb-6 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <Logo className="[&_span]:text-primary-foreground" />
          <button className="relative grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        <p className="mt-5 text-sm text-primary-foreground/80">
          Hi {profile?.name?.split(" ")[0] || "there"} 👋
        </p>
        <h1 className="text-xl font-extrabold">
          {profile?.college || "Your campus"}
        </h1>

        <Link
          to="/notes"
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary-foreground px-4 py-3 text-muted-foreground shadow-float"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search notes, books, rides…</span>
        </Link>

        <div className="mt-3 flex gap-2">
          {FILTERS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-foreground/15 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-primary-foreground/25"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </header>

      <main className="space-y-7 px-5 py-6">
        <Section title="Trending notes" icon={<TrendingUp className="h-4 w-4 text-accent" />} to="/notes">
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {NOTES.filter((n) => n.trending).map((n) => (
              <NoteCard key={n.id} note={n} className="w-56 shrink-0" />
            ))}
          </div>
        </Section>

        <Section title="Books for rent nearby" icon={<ShoppingBag className="h-4 w-4 text-accent" />} to="/books">
          <div className="space-y-3">
            {BOOKS.slice(0, 2).map((b) => (
              <BookCard key={b.id} book={b} onChat={setChatBook} />
            ))}
          </div>
        </Section>

        <Section title="Active ride pools" icon={<Bus className="h-4 w-4 text-accent" />} to="/transit">
          <div className="space-y-3">
            {RIDES.slice(0, 2).map((r) => (
              <RideCard key={r.id} ride={r} />
            ))}
          </div>
        </Section>
      </main>

      <ChatDialog book={chatBook} onOpenChange={(open) => !open && setChatBook(null)} />
    </AppLayout>
  );
}

function Section({
  title,
  icon,
  to,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  to: "/notes" | "/books" | "/transit";
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground">
          {icon}
          {title}
        </h2>
        <Link to={to} className="flex items-center text-xs font-semibold text-primary">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {children}
    </section>
  );
}
