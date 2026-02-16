import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

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
 * - Google Analytics (gtag.js)
 */
const getCspHeader = () => {
  const isDev = process.env.NODE_ENV === "development";
  
  // Monaco editor requires worker-src blob: and script-src unsafe-eval
  // Web Workers need blob: for dynamic worker creation
  // unsafe-eval is required for Monaco's syntax highlighting workers
  // Google Analytics requires connect-src to google-analytics.com
  const scriptSrc = "'self' 'unsafe-eval' 'unsafe-inline' blob:";
  
  const csp = [
    // Default fallback
    "default-src 'self'",
    // Scripts - Next.js requires unsafe-inline for hydration
    // Monaco editor requires 'unsafe-eval' and blob: for web workers
    `script-src ${scriptSrc} https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com`,
    // Styles - Next.js requires unsafe-inline for styled-jsx
    // Monaco injects styles dynamically
    "style-src 'self' 'unsafe-inline'",
    // Workers - Monaco creates web workers from blob URLs
    "worker-src 'self' blob:",
    // Images - allow data URIs and configured remote hosts
    "img-src 'self' blob: data: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://www.google-analytics.com",
    // Fonts
    "font-src 'self'",
    // Connect (API calls, WebSockets, Google Analytics)
    "connect-src 'self' https://cdn.jsdelivr.net https://api.mainnet-beta.solana.com https://api.devnet.solana.com wss://api.mainnet-beta.solana.com wss://api.devnet.solana.com https://www.google-analytics.com",
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

// Apply next-intl plugin
const withIntlConfig = withNextIntl(nextConfig);

// Only wrap with Sentry if DSN is configured (opt-in)
const finalConfig = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(withIntlConfig, { silent: true })
  : withIntlConfig;

export default finalConfig;
