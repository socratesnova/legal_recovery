import type { NextConfig } from "next";

const isWindows = process.platform === "win32";

const nextConfig: NextConfig = {
  // Standalone output is required for the Docker image, but Windows local builds
  // cannot create symlinks without elevated privileges / Developer Mode.
  output: isWindows ? undefined : "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
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
