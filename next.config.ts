import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'gelbooru.com' }, { hostname: '*.gelbooru.com' }],
  },
}

export default nextConfig
