import type { MetadataRoute } from "next";
import { withBase } from "@/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "West Coast Swing Passport 2026–2027",
    short_name: "WCS Passport",
    description: "La Guía Definitiva del Circuito Europeo: De la Pista Local al Mundo.",
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "es",
    icons: [
      { src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: withBase("/icon-maskable.svg"), sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
