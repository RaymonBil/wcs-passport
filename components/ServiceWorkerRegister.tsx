"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/base-path";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register(withBase("/sw.js")).catch(() => {});
    }
  }, []);
  return null;
}
