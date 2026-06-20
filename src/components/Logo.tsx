import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-hero text-primary-foreground shadow-card">
        <GraduationCap className="h-5 w-5" />
      </div>
      {showText && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          Campu<span className="text-accent">Share</span>
        </span>
      )}
    </div>
  );
}
