import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.bhphoto.com",
      },
    ],
  },
};

export default nextConfig;
