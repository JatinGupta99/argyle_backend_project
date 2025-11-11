/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dl.dir.freefiremobile.com',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
