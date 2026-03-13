/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Disable static generation for API routes and dynamic pages
  generateStaticParams: false,
  // Set output to standalone for better containerization
  output: 'standalone',
  // Ensure dynamic routes are handled properly
  trailingSlash: false,
}

module.exports = nextConfig