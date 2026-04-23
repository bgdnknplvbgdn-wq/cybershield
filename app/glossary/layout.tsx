import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Словарь — КИБЕРЩИТ",
  description: "Словарь терминов кибербезопасности",
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
