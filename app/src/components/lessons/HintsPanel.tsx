"use client";

import React from "react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, ChevronRight, AlertCircle, ListChecks, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export type HintKind = "text" | "checklist" | "snippet";

export interface HintItem {
  title?: string;
  body: string;
  kind?: HintKind;
}

export interface HintsPanelProps {
  hints?: Array<HintItem | string>;
  defaultOpen?: boolean;
}

function isHintItem(value: unknown): value is HintItem {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.body === "string";
}

export function normalizeHints(hints: HintsPanelProps["hints"]): HintItem[] {
  if (!Array.isArray(hints)) {
    return [];
  }

  const normalized: HintItem[] = [];
  for (const entry of hints) {
    if (typeof entry === "string") {
      const body = entry.trim();
      if (body.length > 0) {
        normalized.push({ body, kind: "text" });
      }
      continue;
    }

    if (isHintItem(entry)) {
      const body = entry.body.trim();
      if (body.length > 0) {
        normalized.push({
          title: typeof entry.title === "string" && entry.title.trim().length > 0 ? entry.title.trim() : undefined,
          body,
          kind: entry.kind ?? "text",
        });
      }
    }
  }

  return normalized;
}

export function nextRevealCount(current: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(total, Math.max(1, current + 1));
}

function hintKindLabel(kind: HintKind): string {
  switch (kind) {
    case "checklist":
      return "Checklist";
    case "snippet":
      return "Snippet";
    default:
      return "Hint";
  }
}

export function HintsPanel({ hints, defaultOpen = false }: HintsPanelProps) {
  const t = useTranslations("lesson");
  const normalizedHints = useMemo(() => normalizeHints(hints), [hints]);
  const totalHints = normalizedHints.length;
  const [revealedCount, setRevealedCount] = useState(() =>
    defaultOpen && totalHints > 0 ? 1 : 0
  );

  const visibleHints = normalizedHints.slice(0, revealedCount);
  const hasMoreHints = revealedCount < totalHints;

  return (
    <Card className="border-blue-200/70 bg-blue-50/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            {t("hintsTitle")}
            <Badge variant="secondary">{totalHints}</Badge>
          </CardTitle>
          {totalHints > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setRevealedCount((current) => nextRevealCount(current, totalHints))}
                disabled={!hasMoreHints}
                className="gap-1"
              >
                {t("revealNextHint")}
                <ChevronRight className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setRevealedCount(totalHints)}
                disabled={revealedCount >= totalHints}
              >
                {t("revealAllHints")}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalHints === 0 && (
          <div className="rounded-lg border border-dashed border-blue-300/70 bg-white/70 p-4">
            <p className="text-sm font-medium text-blue-900">{t("noHintsYet")}</p>
            <p className="mt-1 text-xs text-blue-700/80">
              {t("reportHintDataIssue")}
            </p>
            <Button type="button" size="sm" variant="outline" className="mt-3">
              {t("reportIssue")}
            </Button>
          </div>
        )}

        {totalHints > 0 && revealedCount === 0 && (
          <div className="rounded-lg border border-dashed border-blue-300/70 bg-white/70 p-4">
            <p className="text-sm text-blue-900">{t("hintsAvailable")}</p>
            <p className="mt-1 text-xs text-blue-700/80">{t("useRevealNextHint")}</p>
          </div>
        )}

        {visibleHints.map((hint, index) => (
          <div key={`${index}-${hint.title ?? "hint"}`} className="rounded-lg border border-blue-200 bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              {hint.kind === "checklist" && <ListChecks className="h-4 w-4 text-blue-700" />}
              {hint.kind === "snippet" && <Code2 className="h-4 w-4 text-blue-700" />}
              {hint.kind === "text" && <AlertCircle className="h-4 w-4 text-blue-700" />}
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {hint.title ?? `${hintKindLabel(hint.kind ?? "text")} ${index + 1}`}
              </span>
            </div>
            <div className="prose prose-sm max-w-none text-blue-950 prose-pre:bg-slate-950 prose-pre:text-slate-100">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint.body}</ReactMarkdown>
            </div>
            {index < visibleHints.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
