import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
