import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/mock-data";

type Msg = { id: number; from: "me" | "them"; text: string };

const AUTO_REPLIES = [
  "Hey! Yes it's still available 🙌",
  "Sure, we can swap on campus. When are you free?",
  "Meet near the library at lunch?",
  "Cool, see you there!",
];

export function ChatDialog({
  book,
  onOpenChange,
}: {
  book: Book | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const replyIdx = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (book) {
      replyIdx.current = 0;
      setMessages([
        { id: 1, from: "them", text: `Hi! Interested in "${book.title}"? 😊` },
      ]);
    }
  }, [book]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const mine: Msg = { id: Date.now(), from: "me", text: draft.trim() };
    setMessages((m) => [...m, mine]);
    setDraft("");
    const reply = AUTO_REPLIES[replyIdx.current % AUTO_REPLIES.length];
    replyIdx.current += 1;
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "them", text: reply }]);
    }, 700);
  };

  return (
    <Dialog open={!!book} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[70vh] max-w-sm flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3 text-left">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-lg">
              {book?.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold">{book?.seller}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {book?.title}
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-2 overflow-y-auto bg-muted/40 p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <span
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                  m.from === "me"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground shadow-card",
                )}
              >
                {m.text}
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className="flex-1"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
