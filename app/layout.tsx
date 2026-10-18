import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { BottomNav } from "@/components/shell/BottomNav";
import { Hydrator } from "@/components/shell/Hydrator";
import { InstallProvider } from "@/components/shell/InstallPrompt";
import { TopBar } from "@/components/shell/TopBar";
import { withBase } from "@/lib/base-path";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["600", "700", "800", "900"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "West Coast Swing Passport 2026–2027", template: "%s · WCS Passport" },
  description:
    "La Guía Definitiva del Circuito Europeo de West Coast Swing: 47 festivales con ficha completa, buscador, agenda, calendario y pasaporte. Edición Especial Levante West Coast Swing | LOBAILAO.",
  applicationName: "WCS Passport",
  appleWebApp: { capable: true, title: "WCS Passport", statusBarStyle: "black-translucent" },
  manifest: withBase("/manifest.webmanifest"),
  icons: { icon: withBase("/icon.svg"), apple: withBase("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`dark ${inter.variable} ${montserrat.variable}`}>
      <body className="overflow-x-hidden">
        <InstallProvider>
          <TopBar />
          <main className="min-h-[100svh] pb-[calc(5rem+env(safe-area-inset-bottom))]">{children}</main>
          <BottomNav />
        </InstallProvider>
        <Hydrator />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
