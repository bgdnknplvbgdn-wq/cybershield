import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "accent" | "success" | "error" | "none";
  onClick?: () => void;
}

export function Card({
  children,
  className,
  glow = "none",
  onClick,
}: CardProps) {
  const glowClass = {
    accent: "neon-glow",
    success: "neon-glow-success",
    error: "neon-glow-error",
    none: "",
  }[glow];

  return (
    <div
      className={cn("card-base", glowClass, onClick && "cursor-pointer", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "accent" | "success" | "error" | "warning" | "muted";
  className?: string;
}

export function Badge({ children, variant = "accent", className }: BadgeProps) {
  const variantClass = {
    accent: "bg-accent/20 text-accent",
    success: "bg-success/20 text-success",
    error: "bg-error/20 text-error",
    warning: "bg-warning/20 text-warning",
    muted: "bg-muted/20 text-muted",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-btn text-xs font-mono font-semibold",
        variantClass,
        className
      )}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div
      className={cn(
        "w-full h-2 bg-card-border rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-accent rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
