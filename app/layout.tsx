import type { Metadata, Viewport } from "next";
import { BottomNav, ThemeProvider } from "@/components/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: "КИБЕРЩИТ — Испытание",
  description:
    "Интерактивная платформа кибербезопасности для граждан Республики Беларусь",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-background text-foreground font-heading antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
        <ThemeProvider>
          <header className="hidden md:flex fixed top-0 left-20 right-0 h-14 items-center px-6 bg-card/80 backdrop-blur-md border-b border-card-border z-40">
            <span className="text-xl font-bold tracking-wide">
              <span className="mr-2">🛡️</span>
              <span className="text-gradient">КИБЕРЩИТ</span>
            </span>
          </header>

          <main className="md:ml-20 md:mt-14 pb-20 md:pb-4 min-h-screen">
            {children}
          </main>

          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
