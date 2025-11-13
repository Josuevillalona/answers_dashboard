import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set runtime to nodejs to ensure proper environment variable handling
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip static page generation for auth routes
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
