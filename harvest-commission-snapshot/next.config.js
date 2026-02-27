/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ALL ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore ALL TypeScript errors during build
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
