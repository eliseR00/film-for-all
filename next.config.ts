import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.bhphoto.com",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "assets.bigcartel.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
    ],
  },
};

export default nextConfig;
