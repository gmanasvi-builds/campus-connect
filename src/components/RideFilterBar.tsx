import { MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RideSort = "price-asc" | "price-desc" | "nearest";

export type RideFilters = {
  query: string;
  maxPrice: number;
  sort: RideSort;
};

export function defaultRideFilters(priceCeiling: number): RideFilters {
  return { query: "", maxPrice: priceCeiling, sort: "price-asc" };
}

export function RideFilterBar({
  filters,
  onChange,
  onReset,
  priceCeiling,
  isDirty,
}: {
  filters: RideFilters;
  onChange: (next: RideFilters) => void;
  onReset: () => void;
  priceCeiling: number;
  isDirty: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-accent" />
          <h2 className="truncate text-sm font-bold text-foreground">Filter rides</h2>
        </div>
        {isDirty && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onReset}>
            Clear Filters
          </Button>
        )}
      </header>

      <div className="mt-3 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ride-search" className="text-xs font-semibold">
            Filter by Origin or Destination
          </Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
            <Input
              id="ride-search"
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="e.g. Metro, CBIT Campus"
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs font-semibold">Max Price (₹)</Label>
              <span className="text-xs font-bold text-primary">
                {filters.maxPrice >= priceCeiling
                  ? "Any price"
                  : filters.maxPrice === 0
                    ? "Free rides only"
                    : `Under ₹${filters.maxPrice}`}
              </span>
            </div>
            <Slider
              min={0}
              max={priceCeiling}
              step={5}
              value={[filters.maxPrice]}
              onValueChange={([v]) => onChange({ ...filters, maxPrice: v ?? 0 })}
              aria-label="Max price"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>₹0</span>
              <span>₹{priceCeiling}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sort by</Label>
            <Select
              value={filters.sort}
              onValueChange={(v) => onChange({ ...filters, sort: v as RideSort })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Lowest Price First</SelectItem>
                <SelectItem value="price-desc">Highest Price First</SelectItem>
                <SelectItem value="nearest">Nearest Location First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
