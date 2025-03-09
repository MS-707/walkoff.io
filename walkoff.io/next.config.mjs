/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content.mlb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.mlb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.mlbstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mlbstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'securea.mlb.com',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
