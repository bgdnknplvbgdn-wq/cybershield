"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Shield } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialize } = useAuthStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initialize().finally(() => setReady(true));
  }, [initialize]);

  useEffect(() => {
    if (ready && !loading && !user) {
      router.push("/auth");
    }
  }, [ready, loading, user, router]);

  if (!ready || loading) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center">
        <Shield size={40} className="text-accent animate-pulse mb-3" />
        <p className="text-muted text-sm font-mono">Проверка доступа...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
