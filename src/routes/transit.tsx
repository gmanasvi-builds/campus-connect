import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Navigation, Clock, SearchX } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { RideCard } from "@/components/cards";
import { PageHeader } from "@/components/PageHeader";
import {
  RideFilterBar,
  defaultRideFilters,
  type RideFilters,
} from "@/components/RideFilterBar";
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
  const rides = useMemo(() => [...posted, ...RIDES], [posted]);

  const priceCeiling = useMemo(
    () => Math.max(1000, ...rides.map((r) => r.costPerHead)),
    [rides],
  );
  const [filters, setFilters] = useState<RideFilters>(() => defaultRideFilters(1000));
  const resetFilters = () => setFilters(defaultRideFilters(priceCeiling));
  const isDirty =
    filters.query !== "" || filters.maxPrice < priceCeiling || filters.sort !== "price-asc";

  const visible = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = rides.filter(
      (r) =>
        r.costPerHead <= filters.maxPrice &&
        (q === "" ||
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q)),
    );
    return list.sort((a, b) => {
      if (filters.sort === "price-asc") return a.costPerHead - b.costPerHead;
      if (filters.sort === "price-desc") return b.costPerHead - a.costPerHead;
      return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
    });
  }, [rides, filters]);

  return (
    <AppLayout>
      <PageHeader title="Campus Ride Pool" subtitle="Share a ride, split the fare" />

      <div className="px-5 pt-4">
        <RideFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          priceCeiling={priceCeiling}
          isDirty={isDirty}
        />
      </div>

      <div className="flex items-center gap-1.5 px-5 pt-4 text-xs font-medium text-muted-foreground">
        <Navigation className="h-3.5 w-3.5 text-accent" />
        {visible.length} of {rides.length} pools match your filters
      </div>

      <main className="space-y-3 px-5 py-4">
        {visible.map((r) => (
          <div key={r.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
            <RideCard ride={r} />
          </div>
        ))}

        {visible.length === 0 && (
          <div className="animate-in fade-in rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-card duration-300">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
              <SearchX className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              No rides found matching your filters.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try increasing your max price or clearing search terms.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
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
