import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Motion pieces are imperative and mounted once per view; strict mode's
  // double effects would mount them twice in development.
  reactStrictMode: false,
}

export default nextConfig
