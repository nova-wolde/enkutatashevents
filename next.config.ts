import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    'preview-chat-383ad46b-3ee2-4a42-b3af-48307ee6c222.space-z.ai',
  ],
};

export default nextConfig;
