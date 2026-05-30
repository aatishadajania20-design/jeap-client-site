/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 100],
  },
  // NOTE: `three` is intentionally NOT transpiled. Adding it to
  // transpilePackages forces Next to re-compile the entire (very large) three.js
  // bundle and balloons the "Collecting build traces" step's memory/time, which
  // is what was OOM-ing the Vercel build. Modern three ships ESM that Next
  // consumes directly, and all WebGL entry points are dynamic({ ssr: false }).
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default nextConfig;
