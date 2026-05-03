import type { Metadata, Viewport } from "next";
import { BottomNav, MatrixRain, ThemeProvider } from "@/components/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: "КИБЕРРУБЕЖ",
  description:
    "Интерактивная образовательная платформа по кибербезопасности. Автор: Коноплёв Богдан Михайлович",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050a0f",
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
          <MatrixRain />
          <header className="hidden md:flex fixed top-0 left-20 right-0 h-14 items-center px-6 bg-card/90 backdrop-blur-md border-b border-card-border/50 z-40">
            <span className="text-xl font-bold tracking-widest font-cyber glitch-text">
              <span className="text-gradient">КИБЕР</span>
              <span className="text-foreground">РУБЕЖ</span>
            </span>
            <div className="ml-auto flex items-center gap-4">
              <div className="terminal-header">
                <span>v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="status-dot bg-accent" />
                <span className="text-xs font-mono text-muted">СИСТЕМА АКТИВНА</span>
              </div>
            </div>
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
