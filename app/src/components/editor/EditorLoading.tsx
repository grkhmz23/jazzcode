"use client";

import { useTranslations } from "next-intl";

interface EditorLoadingProps {
  height?: string;
}

/**
 * EditorLoading - A skeleton placeholder for the Monaco editor
 * Shows a dark background with subtle shimmer animation while Monaco loads
 */
export function EditorLoading({ height = "100%" }: EditorLoadingProps) {
  const t = useTranslations("challenge");
  return (
    <div
      className="w-full overflow-hidden rounded-md border bg-muted/40"
      style={{ height }}
      data-testid="editor-loading"
    >
      <div className="border-b bg-muted/70 px-4 py-2 text-xs text-muted-foreground">
        {t("loadingEditor")}
      </div>
      <div className="space-y-3 p-4">
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-muted-foreground/20" />
      </div>
    </div>
  );
}
