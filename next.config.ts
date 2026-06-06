import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Output ──────────────────────────────────────────────────────────────────
  output: "standalone",

  // ─── Strict Mode ─────────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── TypeScript ──────────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },

  // ─── Image Optimization ──────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enkutatashevents.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // ─── Compression ─────────────────────────────────────────────────────────────
  compress: true,

  // ─── Remove X-Powered-By ────────────────────────────────────────────────────
  poweredByHeader: false,

  // ─── Security Headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://enkutatashevents.com",
              "connect-src 'self' https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/events/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ─── Allowed Dev Origins ─────────────────────────────────────────────────────
  allowedDevOrigins: [
    "preview-chat-383ad46b-3ee2-4a42-b3af-48307ee6c222.space-z.ai",
  ],
};

export default nextConfig;
