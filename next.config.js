/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/openlaptop-viewer' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/openlaptop-viewer' : '',
  turbopack: {},
  experimental: {
    turbo: {}
  }
}

module.exports = nextConfig
