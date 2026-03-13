/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Set output to standalone for better containerization
  output: 'standalone',
  // Ensure dynamic routes are handled properly
  trailingSlash: false,
  // Configure static export settings
  exportTrailingSlash: false,
  // Skip static generation for API routes
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig