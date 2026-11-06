import type { NextConfig } from "next";

// L'admin Keystatic (storage "local") n'a de sens qu'en développement : ses
// fichiers portent l'extension `.dev.tsx` / `.dev.ts` et ne sont routés qu'en
// `next dev`. Le build de production est un export statique pour GitHub Pages.
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: isDev ? undefined : "export",
  pageExtensions: isDev ? ["dev.tsx", "dev.ts", "tsx", "ts", "jsx", "js"] : ["tsx", "ts", "jsx", "js"],
  // GitHub Pages ne sert que des fichiers : pas d'optimisation d'images à la volée.
  images: { unoptimized: true },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
