/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tommivk-marketplace.imgix.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    IMGIX_BASE_URL: process.env.IMGIX_BASE_URL,
  }
}

module.exports = nextConfig
