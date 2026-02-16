"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Locale-aware Error Boundary
 * Catches errors within the [locale] route segment
 * Reports to Sentry and provides a user-friendly error UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mt-4 text-2xl font-bold">{t("error")}</h2>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve been notified and are working to fix the issue.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={reset} variant="default">
            {t("retry")}
          </Button>
        </div>
      </div>
    </div>
  );
}
