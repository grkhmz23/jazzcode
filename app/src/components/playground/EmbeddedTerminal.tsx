"use client";

import { useCallback, useState } from "react";
import { TerminalPane } from "@/components/playground/TerminalPane";
import {
  applySuggestion,
  getAutocompleteSuggestions,
} from "@/lib/playground";
import { PlaygroundRuntime } from "@/lib/playground/runtime";

interface EmbeddedTerminalProps {
  runtime: PlaygroundRuntime;
}

function makeEntry(kind: "input" | "output" | "system" | "error", text: string) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    kind,
    text,
    timestamp: Date.now(),
  };
}

export function EmbeddedTerminal({ runtime }: EmbeddedTerminalProps) {
  const [entries, setEntries] = useState(() => [
    makeEntry("system", "Terminal ready. Run `help` to list commands."),
  ]);

  const handleRunCommand = useCallback(
    async (command: string) => {
      setEntries((prev) => [...prev, makeEntry("input", `$ ${command}`)]);

      try {
        const result = await runtime.executeCommand(command);
        if (result.shouldClear) {
          setEntries([]);
        }
        if (result.lines.length > 0) {
          setEntries((prev) => [
            ...prev,
            ...result.lines.map((line) => makeEntry(line.kind, line.text)),
          ]);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Command failed.";
        setEntries((prev) => [...prev, makeEntry("error", msg)]);
      }
    },
    [runtime]
  );

  const handleAutocomplete = useCallback(
    (input: string) =>
      getAutocompleteSuggestions({
        input,
        filePaths: Object.keys(runtime.getWorkspace().files),
      }),
    [runtime]
  );

  return (
    <TerminalPane
      entries={entries}
      commandHistory={runtime.getTerminalState().commandHistory}
      onRunCommand={(cmd) => void handleRunCommand(cmd)}
      onAutocomplete={handleAutocomplete}
      onApplySuggestion={applySuggestion}
    />
  );
}
