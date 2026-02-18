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

function parseOrigin(value) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Content Security Policy
 * Why these directives exist:
 * - default-src 'self': deny all third-party origins unless explicitly needed.
 * - script-src includes unsafe-eval/unsafe-inline only because Monaco + Next hydration require them.
 * - style-src unsafe-inline is required by styled-jsx/Tailwind runtime styles.
 * - connect-src is restricted to app origin + devnet RPC + optional runner + telemetry.
 * - worker-src blob: is required for Monaco workers.
 * - frame-ancestors none and X-Frame-Options DENY block clickjacking.
 * - base-uri none and form-action self reduce injection/phishing pivots.
 *
 * Removing Monaco-related exceptions ('unsafe-eval', blob worker-src) breaks editor syntax workers.
 * Removing 'unsafe-inline' for scripts/styles breaks Next.js hydration and styled-jsx behavior.
 */
const getCspHeader = () => {
  const isDev = process.env.NODE_ENV === "development";
  const runnerOrigin = parseOrigin(process.env.RUNNER_URL);
  const telemetryConnect = [
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
  ];
  const connectSrc = [
    "'self'",
    "https://api.devnet.solana.com",
    ...(runnerOrigin ? [runnerOrigin] : []),
    ...telemetryConnect,
  ];

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self'",
    "img-src 'self' blob: data: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://www.google-analytics.com",
    "font-src 'self'",
    `connect-src ${connectSrc.join(" ")}`,
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'none'",
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
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
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
