/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler : mémorise les composants et leurs éléments, pour qu'un
  // −/+ ne redessine que ce qui change au lieu de toute la fiche.
  reactCompiler: true,
};

export default nextConfig;
