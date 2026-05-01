import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['@prisma/adapter-pg', 'pg', '../lib/generated/prisma/client'],
  images: {
    remotePatterns: [{ hostname: 'gelbooru.com' }, { hostname: '*.gelbooru.com' }],
    unoptimized: true,
  },
}

export default nextConfig
