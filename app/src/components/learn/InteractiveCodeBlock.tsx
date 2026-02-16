"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLearnRuntime } from "@/components/learn/runtime-context";

export function InteractiveCodeBlock({
  filePath,
  language,
}: {
  filePath: string;
  language?: string;
}) {
  const { getFileContent, updateFileContent, runSnippet } = useLearnRuntime();
  const initial = useMemo(() => getFileContent(filePath), [filePath, getFileContent]);
  const [code, setCode] = useState<string>(initial);
  const [result, setResult] = useState<string>("");

  return (
    <div className="my-4 rounded-lg border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{filePath}</span>
        <span>{language ?? "text"}</span>
      </div>
      <textarea
        className="min-h-[160px] w-full rounded border bg-background p-2 font-mono text-sm"
        value={code}
        onChange={(event) => {
          const next = event.target.value;
          setCode(next);
          updateFileContent(filePath, next);
        }}
      />
      <div className="mt-2 flex items-center justify-between">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            runSnippet(filePath, code);
            setResult(`Executed ${filePath} with ${code.length} chars`);
          }}
        >
          Run
        </Button>
        <span className="text-xs text-muted-foreground">{result}</span>
      </div>
    </div>
  );
}
