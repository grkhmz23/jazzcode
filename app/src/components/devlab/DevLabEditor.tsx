"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import { X } from "lucide-react";
import { getActiveMissionFromStore, readActiveFileContent, useDevLabStore } from "@/lib/devlab/store";

import { configureMonacoLoader } from "@/lib/monaco-loader";

const MonacoEditor = dynamic(
  () => {
    configureMonacoLoader();
    return import("@monaco-editor/react");
  },
  { ssr: false }
);

function languageFor(path: string): string {
  if (path.endsWith(".rs")) return "rust";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".toml")) return "ini";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  return "plaintext";
}

export function DevLabEditor() {
  const openFiles = useDevLabStore((state) => state.openFiles);
  const activeFile = useDevLabStore((state) => state.activeFile);
  const closeFile = useDevLabStore((state) => state.closeFile);
  const openFile = useDevLabStore((state) => state.openFile);
  const updateFile = useDevLabStore((state) => state.updateFile);
  const content = useDevLabStore(readActiveFileContent);
  const mission = useDevLabStore(getActiveMissionFromStore);
  const dirtyRef = useRef<Record<string, boolean>>({});
  const [decorations, setDecorations] = useState<string[]>([]);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const language = useMemo(() => languageFor(activeFile ?? ""), [activeFile]);

  useEffect(() => {
    const current = editorRef.current;
    if (!current) return;
    if (!activeFile) return;

    const hasEditObjective = mission.objectives.some((objective) => objective.type === "edit");
    if (!hasEditObjective) {
      setDecorations(current.deltaDecorations(decorations, []));
      return;
    }

    const model = current.getModel();
    if (!model) return;

    const next = current.deltaDecorations(decorations, [
      {
        range: {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: Math.max(2, model.getLineLength(1)),
        },
        options: {
          isWholeLine: true,
          className: "devlab-inline-highlight",
        },
      },
    ]);
    setDecorations(next);
  }, [activeFile, mission, decorations]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (activeFile) {
          dirtyRef.current[activeFile] = false;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeFile]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#1e1e1e]">
      <div className="flex h-9 items-center overflow-x-auto border-b border-[#3c3c3c] bg-[#2d2d2d]">
        {openFiles.map((filePath) => {
          const active = activeFile === filePath;
          const dirty = dirtyRef.current[filePath];
          return (
            <button
              key={filePath}
              type="button"
              className={`group flex h-full items-center gap-2 border-r border-[#3c3c3c] px-3 text-xs ${
                active ? "bg-[#1e1e1e] text-[#ffffff]" : "bg-[#2d2d2d] text-[#c7c7c7]"
              }`}
              onClick={() => openFile(filePath)}
            >
              <span className="max-w-[180px] truncate">{filePath.split("/").pop()}</span>
              {dirty ? <span className="text-[#dcdcaa]">●</span> : null}
              <span
                className="rounded p-0.5 text-[#9d9d9d] opacity-0 group-hover:opacity-100 hover:bg-[#3b3b3b]"
                onClick={(event) => {
                  event.stopPropagation();
                  closeFile(filePath);
                }}
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative flex-1">
        <MonacoEditor
          path={activeFile ?? "my-solana-project/README.md"}
          language={language}
          theme="vs-dark"
          value={content}
          onChange={(value) => {
            if (!activeFile) return;
            updateFile(activeFile, value ?? "");
            dirtyRef.current[activeFile] = true;
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monaco.editor.defineTheme("devlab-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#1e1e1e",
              },
            });
            monaco.editor.setTheme("devlab-dark");
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "JetBrains Mono, monospace",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
