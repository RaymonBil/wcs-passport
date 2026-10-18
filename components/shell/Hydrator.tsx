"use client";

import { useEffect } from "react";
import { usePassport } from "@/lib/store";

/** Rehidrata el estado guardado tras el montaje y mantiene <html lang> sincronizado. */
export function Hydrator() {
  const lang = usePassport((s) => s.lang);

  useEffect(() => {
    usePassport.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
