import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/**
 * Security headers for production deployment
 * These headers provide defense in depth against common web attacks
 */
const securityHeaders = [
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
];

/**
 * Content Security Policy
 * Configured to work with:
 * - Next.js (inline scripts for hydration)
 * - next/image (image optimization)
 * - next-intl (localization)
 * - Monaco Editor (code editing)
 * - Solana wallet adapters
 */
const getCspHeader = () => {
  const isDev = process.env.NODE_ENV === "development";
  
  // In development, allow unsafe-eval for better DX (HMR, source maps)
  // In production, this is more restrictive
  const scriptSrc = isDev
    ? "'self' 'unsafe-eval' 'unsafe-inline'"
    : "'self' 'unsafe-inline'";
  
  const csp = [
    // Default fallback
    "default-src 'self'",
    // Scripts - Next.js requires unsafe-inline for hydration
    `script-src ${scriptSrc}`,
    // Styles - Next.js requires unsafe-inline for styled-jsx
    "style-src 'self' 'unsafe-inline'",
    // Images - allow data URIs and configured remote hosts
    "img-src 'self' blob: data: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    // Fonts
    "font-src 'self'",
    // Connect (API calls, WebSockets)
    "connect-src 'self' https://api.mainnet-beta.solana.com https://api.devnet.solana.com wss://api.mainnet-beta.solana.com wss://api.devnet.solana.com",
    // Media
    "media-src 'self'",
    // Object (Flash, etc)
    "object-src 'none'",
    // Frame (iframes)
    "frame-src 'self'",
    // Frame ancestors (prevent embedding)
    "frame-ancestors 'none'",
    // Form actions
    "form-action 'self'",
    // Base URI
    "base-uri 'self'",
    // Upgrade insecure requests in production
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  
  return csp;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    const headers = [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: getCspHeader(),
          },
        ],
      },
    ];
    
    // HSTS in production (only on HTTPS)
    if (process.env.NODE_ENV === "production") {
      headers[0].headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    
    return headers;
  },
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react-syntax-highlighter",
    ],
  },
};

export default withNextIntl(nextConfig);
