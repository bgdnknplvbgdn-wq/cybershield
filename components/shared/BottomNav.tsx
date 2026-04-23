"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Map, User, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/missions", label: "Миссии", icon: Gamepad2 },
  { href: "/map", label: "Карта", icon: Map },
  { href: "/glossary", label: "Словарь", icon: BookOpen },
  { href: "/profile", label: "Профиль", icon: User },
  { href: "/about", label: "Инфо", icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar nav */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 bg-card border-r border-card-border z-50">
        <div className="mb-8 text-2xl">🛡️</div>
        <div className="flex flex-col gap-6 flex-1 items-center justify-center">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs transition-colors",
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs transition-colors flex-1 py-2",
                  isActive
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Icon size={18} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
