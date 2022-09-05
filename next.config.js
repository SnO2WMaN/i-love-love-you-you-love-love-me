/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: [
    "page.tsx",
    "page.ts",
    "api.ts",
    "api.tsx",
  ],
};
module.exports = nextConfig;
