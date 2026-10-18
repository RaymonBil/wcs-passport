import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["600", "700", "800", "900"], display: "swap" });

export const metadata: Metadata = {
  title: "West Coast Swing Passport 2026–2027",
  description: "La Guía Definitiva del Circuito Europeo: De la Pista Local al Mundo. Edición Especial Levante West Coast Swing | LOBAILAO.",
  applicationName: "WCS Passport",
  appleWebApp: { capable: true, title: "WCS Passport", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
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
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
