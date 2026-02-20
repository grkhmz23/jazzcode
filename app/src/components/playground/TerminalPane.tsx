"use client";

import { FormEvent, KeyboardEvent, ReactNode, Ref, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutocompleteResult, TerminalEntry } from "@/lib/playground";

interface TerminalPaneProps {
  entries: TerminalEntry[];
  commandHistory: string[];
  onRunCommand: (command: string) => void;
  onAutocomplete: (input: string) => AutocompleteResult;
  onApplySuggestion: (input: string, replacement: string, suggestion: string) => string;
  inputRef?: Ref<HTMLInputElement>;
  topPanel?: ReactNode;
}

export function TerminalPane({
  entries,
  commandHistory,
  onRunCommand,
  onAutocomplete,
  onApplySuggestion,
  inputRef,
  topPanel,
}: TerminalPaneProps) {
  const t = useTranslations("playground");
  const tc = useTranslations("common");
  const [command, setCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);

  const reversedHistory = useMemo(() => [...commandHistory].reverse(), [commandHistory]);
  const autocomplete = useMemo(() => onAutocomplete(command), [onAutocomplete, command]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = command.trim();
    if (!next) {
      return;
    }

    onRunCommand(next);
    setCommand("");
    setHistoryIndex(-1);
    setSuggestionIndex(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, reversedHistory.length - 1);
      if (nextIndex >= 0 && reversedHistory[nextIndex]) {
        setHistoryIndex(nextIndex);
        setCommand(reversedHistory[nextIndex]);
        setSuggestionIndex(-1);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0 && reversedHistory[nextIndex]) {
        setHistoryIndex(nextIndex);
        setCommand(reversedHistory[nextIndex]);
        setSuggestionIndex(-1);
        return;
      }

      setHistoryIndex(-1);
      setCommand("");
      return;
    }

    if (event.key === "Tab") {
      if (autocomplete.suggestions.length === 0) {
        return;
      }
      event.preventDefault();
      const nextIndex = (suggestionIndex + 1) % autocomplete.suggestions.length;
      const suggestion = autocomplete.suggestions[nextIndex];
      const nextValue = onApplySuggestion(command, autocomplete.replacement, suggestion);
      setCommand(nextValue);
      setSuggestionIndex(nextIndex);
      return;
    }

    if (event.key === "Enter" && suggestionIndex >= 0 && autocomplete.suggestions[suggestionIndex]) {
      const nextValue = onApplySuggestion(
        command,
        autocomplete.replacement,
        autocomplete.suggestions[suggestionIndex]
      );
      if (nextValue !== command) {
        event.preventDefault();
        setCommand(nextValue);
        setSuggestionIndex(-1);
      }
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#181818] text-[#d4d4d4]" aria-label={t("terminalPanelAriaLabel")}>
      <div className="border-b border-[#313131] px-3 py-2 text-xs uppercase tracking-wide text-[#9d9d9d]">
        {t("terminalPanelAriaLabel")}
      </div>
      {topPanel ? <div className="border-b border-[#313131] bg-[#1b1b1b] p-3">{topPanel}</div> : null}
      <div className="min-h-0 flex-1 space-y-1 overflow-auto p-3 font-mono text-xs" role="log" aria-live="polite">
        {entries.map((entry) => (
          <p
            key={entry.id}
            className={
              entry.kind === "input"
                ? "text-[#9cdcfe]"
                : entry.kind === "system"
                  ? "text-[#ce9178]"
                  : entry.kind === "error"
                    ? "text-[#f48771]"
                    : "text-[#d4d4d4]"
            }
          >
            {entry.text}
          </p>
        ))}
      </div>
      <div className="border-t border-[#313131] px-2 pt-1">
        {autocomplete.suggestions.length > 0 ? (
          <p className="truncate pb-1 font-mono text-[11px] text-[#9d9d9d]" aria-live="polite">
            {autocomplete.suggestions.slice(0, 6).join("  ")}
          </p>
        ) : null}
      </div>
      <form className="flex items-center gap-2 border-t border-[#313131] p-2" onSubmit={submit}>
        <span className="font-mono text-xs text-[#4ec9b0]" aria-hidden>
          $
        </span>
        <Input
          ref={inputRef}
          value={command}
          onChange={(event) => {
            setCommand(event.target.value);
            setSuggestionIndex(-1);
          }}
          onKeyDown={onKeyDown}
          aria-label={t("terminalCommandInputAriaLabel")}
          className="h-8 border-[#323232] bg-[#1e1e1e] font-mono text-xs"
          placeholder={t("terminalCommandInputPlaceholder")}
        />
        <Button type="submit" size="sm">
          {tc("run")}
        </Button>
      </form>
    </section>
  );
}
