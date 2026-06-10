import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["legal-recovery.licitpilot.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
