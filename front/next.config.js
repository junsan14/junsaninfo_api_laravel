const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
       remotePatterns: [
      {
        protocol: 'http',
        hostname: '172.20.10.6',
      },
      {
        protocol: 'http',
        hostname: 'jun.local',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'api.junsan.info',
      },
      {
        protocol: 'https',
        hostname: 'assets.st-note.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent-iad3-1.cdninstagram.com',
      },
    ],
    },
    /*
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
        },
        {
          source: '/sanctum/:path*',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/:path*`,
        },
      ];
    },
    */
   
  }
  
  module.exports = withNextIntl(nextConfig)
  
