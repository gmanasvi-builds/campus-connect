import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Navigation, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { RideCard } from "@/components/cards";
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
import { RIDES, type Ride } from "@/lib/mock-data";

export const Route = createFileRoute("/transit")({
  head: () => ({
    meta: [
      { title: "Ride Pool — CampuShare" },
      { name: "description", content: "Post or join shared campus commutes — autos, cabs, and bikes." },
    ],
  }),
  component: TransitPage,
});

function TransitPage() {
  const [posted, setPosted] = useState<Ride[]>([]);
  const [open, setOpen] = useState(false);
  const rides = [...posted, ...RIDES];

  return (
    <AppLayout>
      <PageHeader title="Campus Ride Pool" subtitle="Share a ride, split the fare" />

      <div className="flex items-center gap-1.5 px-5 pt-4 text-xs font-medium text-muted-foreground">
        <Navigation className="h-3.5 w-3.5 text-accent" />
        {rides.length} active pools near your campus
      </div>

      <main className="space-y-3 px-5 py-4">
        {rides.map((r) => (
          <RideCard key={r.id} ride={r} />
        ))}
      </main>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full gradient-hero px-5 py-3 text-sm font-bold text-primary-foreground shadow-float"
      >
        <Plus className="h-4 w-4" />
        Post a Ride
      </button>

      <PostRideDialog
        open={open}
        onOpenChange={setOpen}
        onPost={(ride) => {
          setPosted((p) => [ride, ...p]);
          toast.success("Ride pool created!", {
            description: `${ride.origin} → ${ride.destination}`,
          });
        }}
      />
    </AppLayout>
  );
}

function PostRideDialog({
  open,
  onOpenChange,
  onPost,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPost: (ride: Ride) => void;
}) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("2");
  const [mode, setMode] = useState<Ride["mode"]>("Auto");
  const [cost, setCost] = useState("");

  const reset = () => {
    setOrigin("");
    setDestination("");
    setTime("");
    setSeats("2");
    setMode("Auto");
    setCost("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !time) return;
    onPost({
      id: `ride-${Date.now()}`,
      origin,
      destination,
      time,
      seats: Number(seats) || 1,
      mode,
      host: "You",
      costPerHead: Number(cost) || 0,
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
          <DialogTitle>Post a ride pool</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Pick-up
            </Label>
            <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Secunderabad Station" required />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs font-semibold">
              <Navigation className="h-3.5 w-3.5 text-primary" /> Drop
            </Label>
            <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. CBIT Campus" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5 text-accent" /> Time
              </Label>
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="8:30 AM" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as Ride["mode"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Auto", "Cab", "Bus", "Bike"] as const).map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Seats available</Label>
              <Input type="number" min="1" max="6" value={seats} onChange={(e) => setSeats(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cost / head (₹)</Label>
              <Input type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">Create pool</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
