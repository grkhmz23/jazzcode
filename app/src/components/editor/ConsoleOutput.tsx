"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogEntry {
  content: string;
  type: "log" | "error" | "warn" | "info";
}

interface ConsoleOutputProps {
  logs: string[];
  onClear: () => void;
  className?: string;
}

/**
 * Parse log entries and categorize them by type
 */
function parseLogs(logs: string[]): LogEntry[] {
  return logs.map((log) => {
    if (log.startsWith("[ERROR]")) {
      return { content: log.slice(7).trim(), type: "error" };
    }
    if (log.startsWith("[WARN]")) {
      return { content: log.slice(6).trim(), type: "warn" };
    }
    if (log.startsWith("[INFO]")) {
      return { content: log.slice(6).trim(), type: "info" };
    }
    return { content: log, type: "log" };
  });
}

export function ConsoleOutput({ logs, onClear, className }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const parsedLogs = parseLogs(logs);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          Console Output ({logs.length})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        className="max-h-48 overflow-y-auto p-3 font-mono text-sm"
      >
        {parsedLogs.map((entry, index) => (
          <div
            key={index}
            className={cn(
              "py-0.5 break-all",
              entry.type === "error" && "text-red-400",
              entry.type === "warn" && "text-yellow-400",
              entry.type === "info" && "text-blue-400",
              entry.type === "log" && "text-foreground"
            )}
          >
            {entry.content}
          </div>
        ))}
      </div>
    </div>
  );
}
