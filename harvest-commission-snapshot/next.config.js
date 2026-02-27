/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip build optimization for all routes
  outputFileTracing: true,
  // Don't try to optimize API routes during build
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig
