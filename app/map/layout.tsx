"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
