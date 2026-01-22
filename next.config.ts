import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes (for AI summarize feature)
  // Vercel will still optimize and serve the site efficiently
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
