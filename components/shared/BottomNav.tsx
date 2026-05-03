"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Newspaper, User, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/sounds";

const navItems = [
  { href: "/", label: "ГЛАВНАЯ", icon: Home, exact: true },
  { href: "/missions", label: "МИССИИ", icon: Gamepad2 },
  { href: "/map", label: "НОВОСТИ", icon: Newspaper },
  { href: "/glossary", label: "СЛОВАРЬ", icon: BookOpen },
  { href: "/about", label: "ИНФО", icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar nav */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 bg-card/95 border-r border-card-border/50 z-50 backdrop-blur-md">
        <div className="mb-8">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center neon-glow">
            <span className="text-accent font-cyber text-sm font-bold tracking-wider">КР</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-1 items-center justify-center">
          {navItems.map((item) => {
            const isActive = ("exact" in item && item.exact) ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClick}
                className={cn(
                  "flex flex-col items-center gap-1 text-[10px] font-mono tracking-wider py-3 px-2 rounded-lg transition-all w-full relative",
                  isActive
                    ? "text-accent bg-accent/10 border-l-2 border-accent"
                    : "text-muted hover:text-accent hover:bg-accent/5"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-accent/5 animate-pulse-glow pointer-events-none" />
                )}
                <Icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-accent/30 to-transparent" />
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 border-t border-card-border/50 z-50 safe-bottom backdrop-blur-md">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = ("exact" in item && item.exact) ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={playClick}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all flex-1 py-2 relative",
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-accent"
                )}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full shadow-glow" />
                )}
                <Icon size={18} />
                <span className="text-[9px] font-mono tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
