# AGENTS.md — guía para asistentes de IA

West Coast Swing Passport 2026–2027: app web estática (PWA) con los festivales de West Coast Swing de España y Europa, para la comunidad Levante West Coast Swing y la Asociación Cultural LOBAILAO. Interfaz en español (con traducción al inglés).

- Web publicada: https://raymonbil.github.io/wcs-passport/
- Datos abiertos (JSON): https://raymonbil.github.io/wcs-passport/festivals.json
- Resumen para LLMs: https://raymonbil.github.io/wcs-passport/llms.txt

## Stack

Next.js 15 (App Router, `output: "export"`), React 19, TypeScript 5, Tailwind CSS 3, shadcn/ui, Framer Motion, lucide-react, zustand (estado guardado en localStorage), Fuse.js (buscador), Leaflet/react-leaflet (mapa OpenStreetMap), react-qr-code. Sin backend.

## Comandos

```bash
npm install
npm run dev                                         # http://localhost:3000
NEXT_PUBLIC_BASE_PATH=/wcs-passport npm run build   # export estático en out/, igual que en producción
```

`prebuild`/`predev` ejecutan `scripts/generate-static.mjs`, que genera en `public/` los archivos derivados de los datos (no se versionan): `ics/<slug>.ics`, `calendario.ics`, `precache.json`, `festivals.json` y `llms.txt`.

No hay suite de tests: verifica con el build y abriendo las páginas a 390 px de ancho (sin scroll horizontal).

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Festivales (fuente de verdad) | `data/festivals/*.json`, un archivo por zona |
| Guías de ciudad | `data/cities.json` (cada festival apunta con `cityId`) |
| Tipos y helpers de datos | `lib/festivals.ts` |
| Configuración (enlaces, donaciones) | `data/site.ts` |
| Páginas | `app/` (inicio, `agenda`, `explorar`, `festival/[slug]`, `pasaporte`, `guia`, `comunidad`) |
| Componentes | `components/shell` (navegación, PWA), `components/festival`, `components/ui` (shadcn) |
| Service worker | `public/sw.js` |
| Despliegue | `.github/workflows/deploy.yml`: cada push a `main` publica en la rama `gh-pages` |

## Reglas para editar datos de festivales

- Cada festival necesita un `slug` único y un `cityId` que exista en `data/cities.json`.
- `dateStatus`: `"confirmed"` solo si la fecha está publicada por el organizador o la WSDC; si es estimada, usa `"tentative"` y explica el motivo en `dateNote`.
- `wsdc`: `"registry"`, `"trial"` o `"none"`. Solo eventos de West Coast Swing (no Lindy Hop, Balboa, etc.) y solo Europa.
- Precios: indica el año en `priceYear`. Si no hay dato, escribe «Desconocido»; nunca inventes cifras. `priceRefEUR` es el Full Pass aproximado en euros, para la calculadora.
- Añade las URLs consultadas en `sources` y actualiza `verified` (AAAA-MM-DD).
- Las rutas aéreas cambian por temporada: usa formulaciones prudentes («directo según temporada»).

## Convenciones de código

- Textos de la interfaz con `L("español", "english")` de `useLang()` (`lib/i18n.ts`).
- Estado persistente solo a través de `usePassport` (`lib/store.ts`); el acceso a localStorage va envuelto en try/catch.
- Rutas a archivos de `public/` con `withBase()` (`lib/base-path.ts`), porque la web vive en `/wcs-passport`.
- Las clases de Tailwind pueden estar en `app`, `components`, `lib` y `data` (ver `tailwind.config.ts`).
- Mobile first: usa `grid-cols-1` explícito en las cuadrículas responsive para evitar desbordes en móvil.
