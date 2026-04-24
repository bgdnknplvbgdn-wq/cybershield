import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте — КИБЕРРУБЕЖ",
  description: "#КиберПраво — интерактивная образовательная платформа по кибербезопасности",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
