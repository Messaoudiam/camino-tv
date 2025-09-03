import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live *.instagram.com www.instagram.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https: *.cdninstagram.com *.fbcdn.net",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: *.instagram.com",
              "frame-src 'self' https: *.instagram.com www.instagram.com",
            ].join('; ')
          }
        ]
      }
    ]
  }
};

export default nextConfig;
