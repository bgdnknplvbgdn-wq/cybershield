import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "accent" | "success" | "error" | "none";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  glow = "none",
  onClick,
  style,
}: CardProps) {
  const glowClass = {
    accent: "neon-glow",
    success: "neon-glow-success",
    error: "neon-glow-error",
    none: "",
  }[glow];

  return (
    <div
      className={cn("card-base card-shimmer", glowClass, onClick && "cursor-pointer", className)}
      onClick={onClick}
      style={style}
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
    accent: "bg-accent/10 text-accent border border-accent/30",
    success: "bg-success/10 text-success border border-success/30",
    error: "bg-error/10 text-error border border-error/30",
    warning: "bg-warning/10 text-warning border border-warning/30",
    muted: "bg-muted/10 text-muted border border-muted/30",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-btn text-xs font-mono font-semibold uppercase tracking-wider",
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
        "cyber-progress",
        className
      )}
    >
      <div
        className="bar"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
