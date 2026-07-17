import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image optimization is ENABLED for production (remove unoptimized: true)
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // Production Hetzner backend (HTTP direct IP — will be proxied via nginx)
      {
        protocol: 'https',
        hostname: 'api.klik-dz.com',
        pathname: '/**',
      },
      // Fallback: direct IP access
      {
        protocol: 'http',
        hostname: '46.62.212.248',
        pathname: '/**',
      },
    ],
    // Accepted image formats for automatic format conversion (WebP/AVIF)
    formats: ['image/avif', 'image/webp'],
  },

  // Compress responses
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
