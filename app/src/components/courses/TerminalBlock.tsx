"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TerminalBlock as TerminalBlockType } from "@/types/content";

interface TerminalBlockProps {
  block: TerminalBlockType;
}

export function TerminalBlock({ block }: TerminalBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = async (command: string, index: number) => {
    await navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex((current) => (current === index ? null : current));
    }, 1200);
  };

  return (
    <Card className="mt-8 border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">{block.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {block.steps.map((step, index) => (
          <div key={`${block.id}-${step.cmd}`} className="rounded-md border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <code className="text-sm text-primary">$ {step.cmd}</code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void copyCommand(step.cmd, index)}
                aria-label={`Copy command ${step.cmd}`}
              >
                {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-2 text-xs text-muted-foreground">
{step.output}
            </pre>
            {step.note ? <p className="mt-2 text-xs text-muted-foreground">{step.note}</p> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
