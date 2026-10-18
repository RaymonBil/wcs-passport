/** Prefijo de la URL cuando la web no vive en la raíz del dominio (p. ej. GitHub Pages: /wcs-passport). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const withBase = (path: string) => `${basePath}${path}`;
