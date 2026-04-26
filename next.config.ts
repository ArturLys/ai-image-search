import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
  images: {
    remotePatterns: [{ hostname: 'gelbooru.com' }, { hostname: '*.gelbooru.com' }],
  },
}

export default nextConfig
