
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [],
  images: {
    domains: [],
  },
  // Use the existing public directory from the Vite project
  // This will ensure compatibility with existing assets
  experimental: {
    appDir: true,
  }
};

module.exports = nextConfig;
