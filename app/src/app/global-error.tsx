"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Global Error Boundary
 * Catches unhandled errors at the root level and reports to Sentry
 * This is the error.tsx file at the app root - it has no locale
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive">Something went wrong</h1>
          <p className="mt-4 text-muted-foreground">
            We&apos;ve been notified and are working to fix the issue.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
