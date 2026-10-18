"use client";

import { useEffect, useState } from "react";
import { toISODate } from "./festivals";

/** Fecha del build, inyectada por next.config: el HTML estático y la primera hidratación coinciden. */
const BUILD_DAY = (process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString()).slice(0, 10);

/** Hoy (ISO local). Devuelve la fecha del build hasta montar y luego la real del dispositivo. */
export function useToday() {
  const [today, setToday] = useState(BUILD_DAY);
  useEffect(() => {
    setToday(toISODate(new Date()));
  }, []);
  return today;
}
