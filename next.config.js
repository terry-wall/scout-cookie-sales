/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental appDir since it's now stable in Next.js 14
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Ensure proper static generation
  generateEtags: false,
  // Optimize for production builds
  swcMinify: true,
  // Configure image optimization
  images: {
    unoptimized: true
  },
  // Ensure proper API route handling
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig