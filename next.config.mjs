/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler : mémorise les composants et leurs éléments, pour qu'un
  // −/+ ne redessine que ce qui change au lieu de toute la fiche.
  reactCompiler: true,
  // Export PDF : react-pdf tourne tel quel sous Node (sa propre copie de
  // React côté serveur, sans la variante « react-server » des routes).
  serverExternalPackages: ['@react-pdf/renderer'],
  // Les polices du PDF sont lues sur le disque : la fonction les embarque.
  outputFileTracingIncludes: {
    '/api/**/pdf': [
      './node_modules/@fontsource/caveat/files/caveat-latin-*-normal.woff',
      './node_modules/@fontsource/courier-prime/files/courier-prime-latin-*-normal.woff',
      './node_modules/@fontsource/special-elite/files/special-elite-latin-*-normal.woff',
    ],
  },
};

export default nextConfig;
