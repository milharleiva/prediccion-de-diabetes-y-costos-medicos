/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/diabetes/:path*',
        destination: 'http://localhost:8001/:path*',
      },
      {
        source: '/api/insurance/:path*',
        destination: 'http://localhost:8002/:path*',
      },
    ];
  },
};

module.exports = nextConfig;