
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [],
  },
  // Use the existing public directory
  experimental: {
    appDir: true,
  }
};

module.exports = nextConfig;
