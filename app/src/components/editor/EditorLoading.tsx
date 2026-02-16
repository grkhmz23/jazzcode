"use client";

interface EditorLoadingProps {
  height?: string;
}

/**
 * EditorLoading - A skeleton placeholder for the Monaco editor
 * Shows a dark background with subtle shimmer animation while Monaco loads
 */
export function EditorLoading({ height = "100%" }: EditorLoadingProps) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-md bg-muted"
      style={{ height }}
      data-testid="editor-loading"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-md bg-muted-foreground/20" />
        <span className="text-sm text-muted-foreground">Loading editor...</span>
      </div>
    </div>
  );
}
