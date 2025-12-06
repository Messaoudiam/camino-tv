import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Note: 'unsafe-inline' needed for Next.js 15 + Tailwind CSS runtime styles
              // 'unsafe-eval' needed for Vercel Analytics/Speed Insights
              // Consider using nonce-based CSP in the future for better security
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live *.vercel-scripts.com *.vercel-insights.com *.instagram.com www.instagram.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *.cdninstagram.com *.fbcdn.net *.supabase.co",
              "font-src 'self' data:",
              `connect-src 'self' https: wss: ${isDev ? "http://localhost:* ws://localhost:*" : ""} *.instagram.com *.supabase.co *.vercel-insights.com`,
              "frame-src 'self' https: *.instagram.com www.instagram.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
