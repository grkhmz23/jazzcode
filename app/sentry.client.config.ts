import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,
    // Disable session replays by default
    replaysSessionSampleRate: 0,
    // Capture 50% of error sessions for debugging
    replaysOnErrorSampleRate: 0.5,
    // Set environment
    environment: process.env.NODE_ENV || "development",
    // Disable Sentry in development to reduce noise
    enabled: process.env.NODE_ENV === "production",
  });
}
