import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте — КИБЕРЩИТ",
  description: "#КиберПраво: твой щит в сети — интерактивная обучающая платформа кибербезопасности",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
