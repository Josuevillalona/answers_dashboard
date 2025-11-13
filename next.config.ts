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
  // Expose environment variables to the browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default nextConfig;
