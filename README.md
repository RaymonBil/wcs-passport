# West Coast Swing Passport 2026–2027

Revista digital interactiva y app web instalable (PWA) con los festivales de West Coast Swing de España y Europa.
Edición Especial Levante West Coast Swing · Asociación Cultural LOBAILAO.

**Web publicada:** https://raymonbil.github.io/wcs-passport/

## Qué incluye

- **47 festivales** con ficha completa: fechas, sede, tipo WSDC, precios por tramos, consejo Levante, cómo llegar desde Alicante/Valencia/Madrid/Barcelona, guía de la ciudad (cultura, gastronomía, clima), presupuesto y fuentes.
- **Explorar:** buscador tolerante a erratas, filtros (país, mes, tipo, confirmados…), orden por fecha/distancia/precio y vista en **cuadrícula, lista o mapa**.
- **Agenda** mes a mes y **calendario suscribible** (`calendario.ics`) que se actualiza solo; botón «Al calendario» en cada festival (Google Calendar o `.ics`).
- **Mi Pasaporte:** favoritos, sellos de festivales asistidos (con estadísticas), checklist de maleta y presupuesto de temporada. Se guarda en el dispositivo.
- **Guía** para principiantes: WSDC, divisiones y puntos, primer Jack & Jill, ahorro, glosario.
- **Comunidad:** manifiesto, carta del editor, QR de redes y apoyo al proyecto.
- Español / inglés, compartir, QR por festival, instalable en el móvil y **funciona sin conexión**.

## Editar los datos (sin tocar el diseño)

| Qué | Dónde |
|---|---|
| Festivales | `data/festivals/*.json` (un archivo por zona) |
| Guías de ciudad | `data/cities.json` (`cityId` de cada festival) |
| Enlaces, donaciones, email | `data/site.ts` (`donationUrl`, `contactEmail`) |
| Checklist de maleta | `data/checklist.ts` |

Cada festival tiene `dateStatus`: `confirmed` o `tentative` (fecha estimada; se muestra «Por confirmar»).
Al hacer push a `main`, la web se reconstruye y publica sola.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera ics/, calendario.ics, precache.json y el export estático en out/
```

## Estructura

```
app/
  page.tsx · Home.tsx        Inicio
  agenda/                    Agenda + suscripción al calendario
  explorar/                  Buscador, filtros y vistas
  festival/[slug]/           Ficha de cada festival (una página estática por festival)
  pasaporte/                 Favoritos, sellos, maleta, presupuesto
  guia/                      Guía para principiantes
  comunidad/                 Manifiesto, redes, apoyo
components/
  shell/                     Barra superior, navegación inferior, instalación PWA
  festival/                  Tarjetas, portada, mapa, acciones, presupuesto
  ui/                        shadcn/ui
lib/                         Tipos y datos, fechas, distancias, calendario, estado (zustand), idioma
scripts/generate-static.mjs  Genera los .ics y la lista de páginas para uso sin conexión
public/sw.js                 Service worker (modo offline)
```
