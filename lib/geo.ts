export const origins = {
  alicante: { name: "Alicante", coords: [38.3452, -0.481] },
  murcia: { name: "Murcia", coords: [37.9922, -1.1307] },
  cartagena: { name: "Cartagena", coords: [37.6257, -0.9966] },
  torrevieja: { name: "Torrevieja", coords: [37.9787, -0.6822] },
  valencia: { name: "Valencia", coords: [39.4699, -0.3763] },
  madrid: { name: "Madrid", coords: [40.4168, -3.7038] },
  barcelona: { name: "Barcelona", coords: [41.3874, 2.1686] },
} as const satisfies Record<string, { name: string; coords: readonly [number, number] }>;

export type OriginId = keyof typeof origins;

/** Distancia en línea recta (km) con la fórmula del haversine. */
export function distanceKm(a: readonly [number, number], b: readonly [number, number]) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** Estimación orientativa de transporte ida y vuelta según la distancia (editable por el usuario). */
export function travelEstimateEUR(km: number) {
  if (km < 600) return 80;
  if (km < 1500) return 150;
  if (km < 2500) return 200;
  return 280;
}
