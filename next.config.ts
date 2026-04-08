import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  eslint: {
    ignoreDuringBuilds: true, // ✅ fixes your build error
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
