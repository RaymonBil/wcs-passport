# West Coast Swing Passport 2026–2027

Revista digital interactiva (PWA, mobile-first) para Levante West Coast Swing & Asociación Cultural LOBAILAO.

**Web publicada:** https://raymonbil.github.io/wcs-passport/

## Arrancar

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build                # export estático en out/ (activa el service worker / modo offline)
```

## Estructura

```
app/
  layout.tsx              Fuentes (Inter + Montserrat), metadatos y viewport PWA
  page.tsx                Composición de la SPA
  manifest.ts             Manifest PWA (/manifest.webmanifest)
  globals.css             Tokens de tema, .glass, .text-neon-gradient
components/
  ui/                     shadcn/ui: button, card, badge, checkbox
  sections/
    Hero.tsx              A · Portada a pantalla completa + botón "Explorar Guía"
    Manifesto.tsx         B · "El Latido de una Comunidad"
    SocialHub.tsx         C · 3 tarjetas con enlace + QR en tiempo real (react-qr-code)
    FestivalCatalog.tsx   D · Catálogo con filtros y 3 categorías
    EventCard.tsx         D · Tarjeta reutilizable (Reservar / Ver Vuelos)
    TravelerChecklist.tsx E · Checklist con progreso
    Reveal.tsx            Animación de aparición al hacer scroll
  BottomNav.tsx           Navegación inferior estilo app
  ServiceWorkerRegister.tsx
data/events.ts            JSON de eventos + banderas y aeropuertos para "Ver Vuelos"
public/                   sw.js, iconos SVG
```

Para añadir un festival, agrega un objeto a `initialEvents` y su bandera/aeropuerto en `travelInfo` (`data/events.ts`).

## Publicación

Cada push a `main` reconstruye la web y la publica en la rama `gh-pages` (`.github/workflows/deploy.yml`). GitHub Pages sirve esa rama en https://raymonbil.github.io/wcs-passport/.
