"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Workspace } from "@/lib/playground/types";
import { cn } from "@/lib/utils";

interface EditorPaneProps {
  workspace: Workspace;
  onChangeContent: (path: string, content: string) => void;
  onActivateFile: (path: string) => void;
  onCloseFile: (path: string) => void;
}

export function EditorPane({ workspace, onChangeContent, onActivateFile, onCloseFile }: EditorPaneProps) {
  const t = useTranslations("playground");
  const file = workspace.files[workspace.activeFile];

  if (!file) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("noActiveFile")}</div>;
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#1e1e1e] text-[#d4d4d4]" aria-label={t("editorPaneAriaLabel")}>
      <div className="flex min-h-10 items-center overflow-x-auto border-b border-[#2f2f2f] bg-[#181818] px-2">
        {workspace.openFiles.map((path) => {
          const isActive = path === workspace.activeFile;
          const name = path.split("/").pop() ?? path;
          return (
            <div
              key={path}
              className={cn(
                "mr-1 flex items-center rounded-t-md border border-transparent px-2 py-1 text-xs",
                isActive ? "border-[#2f2f2f] bg-[#1e1e1e] text-white" : "text-[#9d9d9d]"
              )}
            >
              <button
                type="button"
                className="max-w-44 truncate text-left"
                onClick={() => onActivateFile(path)}
                aria-current={isActive ? "page" : undefined}
              >
                {name}
                {workspace.files[path]?.readOnly ? " (ro)" : ""}
              </button>
              {workspace.openFiles.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-5 w-5"
                  aria-label={`Close ${name}`}
                  onClick={() => onCloseFile(path)}
                >
                  <X className="h-3 w-3" />
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor
          language={file.language}
          defaultValue={file.content}
          value={file.content}
          onChange={(value) => onChangeContent(file.path, value)}
          theme="vs-dark"
          readOnly={Boolean(file.readOnly)}
        />
      </div>
    </section>
  );
}
