import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiProxyOrigin = process.env.API_PROXY_ORIGIN?.replace(/\/$/, '');
    if (!apiProxyOrigin) {
      if (process.env.VERCEL === '1') {
        throw new Error('API_PROXY_ORIGIN must be set for Vercel deployments');
      }
      return [];
    }

    const apiOrigin = new URL(apiProxyOrigin);
    if (apiOrigin.protocol !== 'https:') {
      throw new Error('API_PROXY_ORIGIN must use HTTPS');
    }

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin.origin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
