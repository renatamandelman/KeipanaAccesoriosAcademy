/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*.replit.dev", "*.worf.replit.dev", "*.repl.co"],
};

module.exports = nextConfig;
