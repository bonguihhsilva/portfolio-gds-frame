import type { NextConfig } from "next";

// Lido no build: em Docker vem do build-arg (http://backend:5000); em dev, da API local.
const backend = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
