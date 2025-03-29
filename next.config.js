/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable experimental features
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  // ... other config options
}

module.exports = nextConfig