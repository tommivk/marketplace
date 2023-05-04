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
  }
}

module.exports = nextConfig
