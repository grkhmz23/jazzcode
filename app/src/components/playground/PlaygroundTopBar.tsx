"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, FolderUp, Github, Upload, FileDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parseZipFile, mergeImportedFiles, sanitizeZipPath, ConflictResolution, ZipImportEntry } from "@/lib/playground/import-zip";
import { WorkspaceFile } from "@/lib/playground/types";
import { inferLanguageFromPath } from "@/lib/playground/workspace";

interface PlaygroundTopBarProps {
  workspaceName: string;
  workspaceFiles: Record<string, WorkspaceFile>;
  activeFile: string | null;
  onImportFiles: (files: Record<string, WorkspaceFile>) => void;
  onExportZip: () => void;
  onExportCurrentFile: () => void;
  onOpenGithubImport: () => void;
  onResetWorkspace: () => void;
  gitBranch?: string | null;
}

export function PlaygroundTopBar({
  workspaceName,
  workspaceFiles,
  activeFile,
  onImportFiles,
  onExportZip,
  onExportCurrentFile,
  onOpenGithubImport,
  onResetWorkspace,
  gitBranch,
}: PlaygroundTopBarProps) {
  const t = useTranslations("playground");
  const tc = useTranslations("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [importDropdownOpen, setImportDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [pendingEntries, setPendingEntries] = useState<ZipImportEntry[]>([]);
  const [conflictPaths, setConflictPaths] = useState<string[]>([]);

  const processFiles = useCallback(
    (entries: ZipImportEntry[]) => {
      const conflicts = entries.filter((e) => Boolean(workspaceFiles[e.path]));
      if (conflicts.length > 0) {
        setPendingEntries(entries);
        setConflictPaths(conflicts.map((c) => c.path));
        setConflictDialogOpen(true);
      } else {
        const now = Date.now();
        const files: Record<string, WorkspaceFile> = {};
        for (const entry of entries) {
          files[entry.path] = {
            path: entry.path,
            language: inferLanguageFromPath(entry.path),
            content: entry.content,
            updatedAt: now,
          };
        }
        onImportFiles(files);
      }
    },
    [workspaceFiles, onImportFiles]
  );

  const handleResolveConflict = useCallback(
    (resolution: ConflictResolution) => {
      const merged = mergeImportedFiles(workspaceFiles, pendingEntries, resolution);
      // Only send the new/changed files
      const diff: Record<string, WorkspaceFile> = {};
      for (const [path, file] of Object.entries(merged)) {
        if (!workspaceFiles[path] || workspaceFiles[path].content !== file.content) {
          diff[path] = file;
        }
      }
      onImportFiles(diff);
      setConflictDialogOpen(false);
      setPendingEntries([]);
      setConflictPaths([]);
    },
    [workspaceFiles, pendingEntries, onImportFiles]
  );

  const handleFileUpload = useCallback(
    async (fileList: FileList) => {
      const entries: ZipImportEntry[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.name.endsWith(".zip")) {
          try {
            const buffer = await file.arrayBuffer();
            const result = parseZipFile(buffer);
            entries.push(...result.entries);
            if (result.skipped.length > 0) {
              console.warn(`Skipped ${result.skipped.length} files in ${file.name}:`, result.skipped);
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            errors.push(`Failed to parse ${file.name}: ${message}`);
          }
        } else {
          const sanitized = sanitizeZipPath(file.name);
          if (sanitized) {
            try {
              const content = await file.text();
              entries.push({ path: sanitized, content, sizeBytes: file.size });
            } catch (error) {
              const message = error instanceof Error ? error.message : "Unknown error";
              errors.push(`Failed to read ${file.name}: ${message}`);
            }
          } else {
            errors.push(`Invalid file path: ${file.name}`);
          }
        }
      }
      
      if (errors.length > 0) {
        console.error("Import errors:", errors);
        // Show the first error to the user
        alert(`Import errors:\n${errors.slice(0, 3).join("\n")}${errors.length > 3 ? `\n... and ${errors.length - 3} more` : ""}`);
      }
      
      if (entries.length > 0) {
        processFiles(entries);
      }
    },
    [processFiles]
  );

  const handleFolderUpload = useCallback(
    async (fileList: FileList) => {
      const entries: ZipImportEntry[] = [];
      const errors: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        const sanitized = sanitizeZipPath(relativePath);
        if (sanitized) {
          try {
            const content = await file.text();
            entries.push({ path: sanitized, content, sizeBytes: file.size });
          } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            errors.push(`Failed to read ${relativePath}: ${message}`);
          }
        } else {
          errors.push(`Invalid file path: ${relativePath}`);
        }
      }

      if (errors.length > 0) {
        console.error("Folder import errors:", errors);
      }

      if (entries.length > 0) {
        processFiles(entries);
      }
    },
    [processFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        void handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  return (
    <>
      <div
        className={`flex h-10 items-center gap-1 border-b px-2 text-xs ${
          dragActive
            ? "border-[#007acc] bg-[#007acc]/10"
            : "border-[#2f2f2f] bg-[#252526]"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="mr-2 truncate font-medium text-[#cccccc]">{workspaceName}</span>

        {/* Import dropdown */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
            onClick={() => {
              setImportDropdownOpen((p) => !p);
              setExportDropdownOpen(false);
            }}
          >
            <Upload className="h-3 w-3" />
            {t("import")}
            <ChevronDown className="h-3 w-3" />
          </Button>
          {importDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded border border-[#454545] bg-[#252526] py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  fileInputRef.current?.click();
                  setImportDropdownOpen(false);
                }}
              >
                <FolderUp className="h-3 w-3" />
                {t("uploadFiles")}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  folderInputRef.current?.click();
                  setImportDropdownOpen(false);
                }}
              >
                <FolderUp className="h-3 w-3" />
                {t("uploadFolder")}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  zipInputRef.current?.click();
                  setImportDropdownOpen(false);
                }}
              >
                <FolderUp className="h-3 w-3" />
                {t("importZip")}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  onOpenGithubImport();
                  setImportDropdownOpen(false);
                }}
              >
                <Github className="h-3 w-3" />
                {t("githubImport")}
              </button>
            </div>
          )}
        </div>

        {/* Export dropdown */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
            onClick={() => {
              setExportDropdownOpen((p) => !p);
              setImportDropdownOpen(false);
            }}
          >
            <Download className="h-3 w-3" />
            {t("export")}
            <ChevronDown className="h-3 w-3" />
          </Button>
          {exportDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-44 rounded border border-[#454545] bg-[#252526] py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  onExportZip();
                  setExportDropdownOpen(false);
                }}
              >
                <Download className="h-3 w-3" />
                {t("exportAsZip")}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
                onClick={() => {
                  onExportCurrentFile();
                  setExportDropdownOpen(false);
                }}
                disabled={!activeFile}
              >
                <FileDown className="h-3 w-3" />
                {t("exportCurrentFile")}
              </button>
            </div>
          )}
        </div>

        {gitBranch && (
          <span className="ml-2 rounded bg-[#2a2d2e] px-2 py-0.5 text-[11px] text-[#9d9d9d]">
            {gitBranch}
          </span>
        )}

        <div className="flex-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
          onClick={onResetWorkspace}
        >
          {tc("reset")}
        </Button>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void handleFileUpload(e.target.files);
            }
            e.target.value = "";
          }}
        />
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void handleFileUpload(e.target.files);
            }
            e.target.value = "";
          }}
        />
        <input
          ref={(el) => {
            (folderInputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
            if (el) el.setAttribute("webkitdirectory", "");
          }}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void handleFolderUpload(e.target.files);
            }
            e.target.value = "";
          }}
        />
      </div>

      {/* Conflict resolution dialog */}
      <Dialog open={conflictDialogOpen} onOpenChange={(open) => { if (!open) { setConflictDialogOpen(false); setPendingEntries([]); setConflictPaths([]); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("importConflictsTitle")}</DialogTitle>
            <DialogDescription>
              {t("importConflictsDescription", { count: conflictPaths.length })}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-40 overflow-auto rounded border border-[#323232] bg-[#1e1e1e] p-2 font-mono text-xs text-[#d4d4d4]">
            {conflictPaths.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => handleResolveConflict("skip")}>
              {t("skipAll")}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleResolveConflict("keep_both")}>
              {t("keepBoth")}
            </Button>
            <Button type="button" onClick={() => handleResolveConflict("overwrite")}>
              {t("overwriteAll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
