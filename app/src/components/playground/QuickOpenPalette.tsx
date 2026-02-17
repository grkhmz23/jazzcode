"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface QuickOpenPaletteProps {
  open: boolean;
  filePaths: string[];
  onSelect: (path: string) => void;
  onClose: () => void;
}

function fuzzyMatch(query: string, target: string): boolean {
  const lower = target.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      qi++;
    }
  }
  return qi === q.length;
}

export function QuickOpenPalette({ open, filePaths, onSelect, onClose }: QuickOpenPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return filePaths.slice().sort();
    return filePaths.filter((p) => fuzzyMatch(query, p)).sort();
  }, [query, filePaths]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex]);
          onClose();
        }
        return;
      }
    },
    [filtered, selectedIndex, onSelect, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-[#454545] bg-[#252526] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search files..."
          className="w-full rounded-t-lg border-b border-[#454545] bg-[#1e1e1e] px-4 py-3 text-sm text-[#d4d4d4] outline-none placeholder:text-[#6d6d6d]"
        />
        <div className="max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[#6d6d6d]">No files match.</p>
          ) : (
            filtered.map((path, i) => (
              <button
                type="button"
                key={path}
                className={`flex w-full items-center px-4 py-2 text-left text-xs ${
                  i === selectedIndex
                    ? "bg-[#04395e] text-white"
                    : "text-[#cccccc] hover:bg-[#2a2d2e]"
                }`}
                onClick={() => {
                  onSelect(path);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className="truncate font-mono">{path}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
