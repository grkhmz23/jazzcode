"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, FileCode2, FileJson, FileText, FolderClosed, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileTreeNode, Workspace, WorkspaceFile } from "@/lib/playground/types";
import { inferLanguageFromPath } from "@/lib/playground/workspace";
import { sanitizeZipPath } from "@/lib/playground/import-zip";

type ExplorerDialog =
  | { mode: "create"; initialPath: string }
  | { mode: "rename"; initialPath: string }
  | { mode: "delete"; initialPath: string }
  | null;

interface FileExplorerProps {
  workspace: Workspace;
  tree: FileTreeNode[];
  onOpenFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onRenameFile: (oldPath: string, nextPath: string) => void;
  onDeleteFile: (path: string) => void;
  onImportFiles?: (files: Record<string, WorkspaceFile>) => void;
}

function iconForFile(path: string) {
  if (path.endsWith(".ts") || path.endsWith(".js")) return <FileCode2 className="h-3.5 w-3.5 text-sky-400" aria-hidden />;
  if (path.endsWith(".json")) return <FileJson className="h-3.5 w-3.5 text-yellow-300" aria-hidden />;
  return <FileText className="h-3.5 w-3.5 text-slate-300" aria-hidden />;
}

export function FileExplorer({
  workspace,
  tree,
  onOpenFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onImportFiles,
}: FileExplorerProps) {
  const t = useTranslations("playground");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [dialog, setDialog] = useState<ExplorerDialog>(null);
  const [nextPath, setNextPath] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (!onImportFiles || !e.dataTransfer.files.length) return;

      const now = Date.now();
      const files: Record<string, WorkspaceFile> = {};

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        const sanitized = sanitizeZipPath(relativePath);
        if (!sanitized) continue;
        const content = await file.text();
        files[sanitized] = {
          path: sanitized,
          language: inferLanguageFromPath(sanitized),
          content,
          updatedAt: now,
        };
      }

      if (Object.keys(files).length > 0) {
        onImportFiles(files);
      }
    },
    [onImportFiles]
  );

  const paths = useMemo(() => Object.keys(workspace.files).sort(), [workspace.files]);

  const toggleCollapsed = (path: string) => {
    setCollapsed((previous) => ({ ...previous, [path]: !previous[path] }));
  };

  const openCreateDialog = (suggestedPath = "src/new-file.ts") => {
    setNextPath(suggestedPath);
    setDialog({ mode: "create", initialPath: suggestedPath });
  };

  const openRenameDialog = (path: string) => {
    setNextPath(path);
    setDialog({ mode: "rename", initialPath: path });
  };

  const openDeleteDialog = (path: string) => {
    setDialog({ mode: "delete", initialPath: path });
  };

  const submitDialog = () => {
    if (!dialog) {
      return;
    }

    if (dialog.mode === "create") {
      onCreateFile(nextPath);
    }

    if (dialog.mode === "rename") {
      onRenameFile(dialog.initialPath, nextPath);
    }

    if (dialog.mode === "delete") {
      onDeleteFile(dialog.initialPath);
    }

    setDialog(null);
  };

  const renderNodes = (nodes: FileTreeNode[]) => {
    return nodes.map((node) => {
      if (node.type === "directory") {
        const isCollapsed = collapsed[node.path] ?? false;
        return (
          <li key={node.path} className="space-y-1">
            <button
              type="button"
              className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs text-slate-300 hover:bg-[#2a2d2f]"
              onClick={() => toggleCollapsed(node.path)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" aria-hidden /> : <ChevronDown className="h-3 w-3" aria-hidden />}
              {isCollapsed ? <FolderClosed className="h-3.5 w-3.5 text-amber-400" aria-hidden /> : <FolderOpen className="h-3.5 w-3.5 text-amber-400" aria-hidden />}
              <span className="truncate">{node.name}</span>
            </button>
            {!isCollapsed ? <ul className="space-y-1 pl-4">{renderNodes(node.children ?? [])}</ul> : null}
          </li>
        );
      }

      const isActive = workspace.activeFile === node.path;
      const isReadOnly = Boolean(workspace.files[node.path]?.readOnly);
      return (
        <li key={node.path}>
          <div className="group flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-200 hover:bg-[#2a2d2f]">
            <button
              type="button"
              className={`flex flex-1 items-center gap-1 text-left ${isActive ? "font-semibold text-white" : ""}`}
              onClick={() => onOpenFile(node.path)}
              aria-current={isActive ? "page" : undefined}
            >
              {iconForFile(node.path)}
              <span className="truncate">{node.name}{isReadOnly ? " (ro)" : ""}</span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100"
              disabled={isReadOnly}
              onClick={() => openRenameDialog(node.path)}
              aria-label={`Rename ${node.path}`}
            >
              <span className="text-[10px]">R</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100"
              disabled={isReadOnly}
              onClick={() => openDeleteDialog(node.path)}
              aria-label={`Delete ${node.path}`}
            >
              <span className="text-[10px]">D</span>
            </Button>
          </div>
        </li>
      );
    });
  };

  return (
    <section
      className={`flex h-full min-h-0 flex-col text-[#d4d4d4] ${dragOver ? "bg-[#007acc]/10" : "bg-[#252526]"}`}
      aria-label={t("fileExplorerAriaLabel")}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
      onDrop={(e) => void handleDrop(e)}
    >
      <div className="flex items-center justify-between border-b border-[#313131] px-3 py-2">
        <p className="text-xs uppercase tracking-wide text-[#9d9d9d]">Explorer</p>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => openCreateDialog()}
          aria-label={t("createFileAriaLabel")}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        <ul className="space-y-1">{renderNodes(tree)}</ul>
      </div>
      <div className="border-t border-[#313131] px-3 py-2 text-xs text-[#9d9d9d]">{paths.length} files</div>

      <Dialog open={Boolean(dialog)} onOpenChange={(open) => (!open ? setDialog(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog?.mode === "create" ? "Create file" : dialog?.mode === "rename" ? "Rename file" : "Delete file"}
            </DialogTitle>
            <DialogDescription>
              {dialog?.mode === "delete"
                ? `Delete ${dialog.initialPath}? This action cannot be undone.`
                : "Use slash-separated paths, for example src/utils/helpers.ts."}
            </DialogDescription>
          </DialogHeader>

          {dialog?.mode !== "delete" ? (
            <Input
              value={nextPath}
              onChange={(event) => setNextPath(event.target.value)}
              aria-label={dialog?.mode === "create" ? "New file path" : "Rename file path"}
            />
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={dialog?.mode === "delete" ? "destructive" : "default"}
              onClick={submitDialog}
            >
              {dialog?.mode === "create" ? "Create" : dialog?.mode === "rename" ? "Rename" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
