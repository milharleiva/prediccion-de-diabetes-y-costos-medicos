/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Para Railway: usar los endpoints JavaScript que llaman a Python
  async rewrites() {
    return [
      // En desarrollo local, estas rutas van a pages/api/*.js
      // En producción Railway, ejecutarán Python directamente
    ];
  },
};

module.exports = nextConfig;