"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { WorkspaceState } from "@/lib/workbench/types";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { XIcon, CircleIcon } from "lucide-react";

import { configureMonacoLoader } from "@/lib/monaco-loader";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => {
    configureMonacoLoader();
    return import("@monaco-editor/react").then((mod) => mod.Editor);
  },
  {
    ssr: false,
    loading: () => <div className="h-full" />,
  }
);

interface EditorPaneProps {
  workspace: WorkspaceState;
  activeFilePath: string | null;
  activeFileContent: string;
  onContentChange: (path: string, content: string) => void;
  onFileSelect: (path: string) => void;
  onFileClose: (path: string) => void;
  onFileSave: (path: string) => void;
  className?: string;
}

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    rs: "rust",
    md: "markdown",
    txt: "plaintext",
  };
  return map[ext] ?? "plaintext";
}

interface EditorTab {
  path: string;
  name: string;
  isDirty: boolean;
}

export function EditorPane({
  workspace,
  activeFilePath,
  activeFileContent,
  onContentChange,
  onFileSelect,
  onFileClose,
  onFileSave,
  className,
}: EditorPaneProps) {
  const t = useTranslations("playground");
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);
  // Build tabs from open files
  const tabs: EditorTab[] = React.useMemo(() => {
    return workspace.openFiles.map((path) => {
      const parts = path.split("/");
      return {
        path,
        name: parts[parts.length - 1] ?? path,
        isDirty: false, // This would be tracked per file in a real implementation
      };
    });
  }, [workspace.openFiles]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Add keyboard shortcuts
    editor.addCommand(
      // Ctrl+S / Cmd+S
      (editor as unknown as { KeyMod: { CtrlCmd: number }; KeyCode: { KeyS: number } }).KeyMod.CtrlCmd |
        (editor as unknown as { KeyMod: { CtrlCmd: number }; KeyCode: { KeyS: number } }).KeyCode.KeyS,
      () => {
        if (activeFilePath) {
          onFileSave(activeFilePath);
        }
      }
    );
  };

  const handleChange = (value: string | undefined) => {
    if (activeFilePath && value !== undefined) {
      onContentChange(activeFilePath, value);
    }
  };

  // Get language for active file
  const language = activeFilePath ? getLanguageFromPath(activeFilePath) : "plaintext";

  return (
    <div className={cn("flex h-full flex-col bg-[#1e1e1e]", className)}>
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border bg-[#252526]">
        {tabs.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">{t("noFilesOpen")}</div>
        ) : (
          tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => onFileSelect(tab.path)}
              className={cn(
                "group flex min-w-0 max-w-[200px] items-center gap-1.5 border-r border-border px-3 py-2 text-sm transition-colors",
                tab.path === activeFilePath
                  ? "bg-[#1e1e1e] text-foreground"
                  : "bg-[#2d2d2d] text-muted-foreground hover:bg-[#2d2d2d]/80"
              )}
            >
              {tab.isDirty && (
                <CircleIcon className="h-2 w-2 fill-current text-muted-foreground" />
              )}
              <span className="flex-1 truncate">{tab.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClose(tab.path);
                }}
                className={cn(
                  "rounded p-0.5 opacity-0 transition-opacity hover:bg-muted",
                  tab.path === activeFilePath && "opacity-100",
                  "group-hover:opacity-100"
                )}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </button>
          ))
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 min-h-0">
        {activeFilePath ? (
          <MonacoEditor
            key={activeFilePath}
            height="100%"
            language={language}
            value={activeFileContent}
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              renderLineHighlight: "all",
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              folding: true,
              lineHeight: 22,
              padding: { top: 16, bottom: 16 },
              theme: "vs-dark",
            }}
            theme="vs-dark"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">{t("noFileSelected")}</p>
              <p className="text-sm">{t("selectFileToEdit")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      {activeFilePath && (
        <div className="flex items-center justify-between border-t border-border bg-[#007acc] px-3 py-1 text-xs text-white">
          <div className="flex items-center gap-4">
            <span>{activeFilePath}</span>
            <span>{language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>{t("editorLineColumn")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
