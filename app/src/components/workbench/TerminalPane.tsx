"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TerminalEntry } from "@/lib/workbench/types";
import { Input } from "@/components/ui/input";


interface TerminalPaneProps {
  entries: TerminalEntry[];
  commandHistory: string[];
  currentDirectory: string;
  onExecuteCommand: (command: string) => void;
  className?: string;
}

export function TerminalPane({
  entries,
  commandHistory,
  currentDirectory,
  onExecuteCommand,
  className,
}: TerminalPaneProps) {
  const [input, setInput] = React.useState("");
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  // Focus input on mount and when clicking container
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onExecuteCommand(input.trim());
      setInput("");
      setHistoryIndex(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex === null) {
        if (commandHistory.length > 0) {
          const lastIndex = commandHistory.length - 1;
          setHistoryIndex(lastIndex);
          setInput(commandHistory[lastIndex] ?? "");
        }
      } else {
        const newIndex = Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] ?? "");
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== null) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(null);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex] ?? "");
        }
      }
      return;
    }

    // Tab completion
    if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion - just for demo
      const commonCommands = ["help", "ls", "cd", "cat", "pwd", "clear", "solana", "anchor", "git"];
      const matching = commonCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()));
      if (matching.length === 1) {
        setInput(matching[0] + " ");
      }
      return;
    }

    // Hide suggestions on escape
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setHistoryIndex(null);

    // Simple suggestion logic
    if (value.length > 0) {
      const commonCommands = [
        "help",
        "ls",
        "cd",
        "cat",
        "pwd",
        "clear",
        "mkdir",
        "touch",
        "rm",
        "cp",
        "mv",
        "echo",
        "solana",
        "solana-keygen",
        "anchor",
        "spl-token",
        "git",
      ];
      const matching = commonCommands.filter((cmd) => cmd.startsWith(value.toLowerCase()));
      setSuggestions(matching.slice(0, 5));
      setShowSuggestions(matching.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setInput(suggestion + " ");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full flex-col bg-[#1e1e1e] font-mono text-sm", className)}
      onClick={handleContainerClick}
    >
      {/* Terminal output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4a4a4a transparent",
        }}
      >
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "whitespace-pre-wrap break-all py-0.5",
              entry.kind === "input" && "text-[#d4d4d4]",
              entry.kind === "output" && "text-[#cccccc]",
              entry.kind === "error" && "text-[#f48771]",
              entry.kind === "system" && "text-[#858585] italic"
            )}
          >
            {entry.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-border p-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[#858585] shrink-0">{currentDirectory}$</span>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-7 border-0 bg-transparent px-0 py-0 font-mono text-sm text-[#d4d4d4] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck={false}
            />

            {/* Autocomplete suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 z-50 mb-1 min-w-[150px] rounded border border-border bg-[#252526] py-1 shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => applySuggestion(suggestion)}
                    className={cn(
                      "w-full px-3 py-1 text-left text-sm",
                      index === 0 ? "bg-accent text-accent-foreground" : "text-[#cccccc] hover:bg-muted"
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Helper text */}
        <div className="mt-1 flex items-center justify-between text-xs text-[#858585]">
          <span>Use ↑↓ for history, Tab for completion</span>
          <span>Press Enter to execute</span>
        </div>
      </div>
    </div>
  );
}
