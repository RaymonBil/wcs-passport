const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export estático: se publica como web estática (GitHub Pages) sin servidor.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    // Fecha del build: el HTML estático se genera con ella y la app la actualiza al abrirse.
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
};

export default nextConfig;
