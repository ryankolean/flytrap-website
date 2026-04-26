import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    taint: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  headers: async () => {
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
