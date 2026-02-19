"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { DirectoryNode, FSNode } from "@/lib/workbench/fs";
import { FileIcon, FolderIcon, FolderOpenIcon, PlusIcon, TrashIcon, Edit2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileExplorerProps {
  fs: DirectoryNode;
  currentPath: string;
  onFileSelect: (path: string) => void;
  onCreateFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onDeleteFile: (path: string) => void;
  className?: string;
}

interface TreeNodeProps {
  node: FSNode;
  level: number;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  onRename: (oldPath: string, newPath: string) => void;
  onDelete: (path: string) => void;
}

function TreeNode({
  node,
  level,
  selectedPath,
  expandedPaths,
  onToggle,
  onSelect,
  onRename,
  onDelete,
}: TreeNodeProps) {
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(node.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const paddingLeft = level * 12 + 8;

  React.useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === "directory") {
      onToggle(node.path);
    }
  };

  const handleSelect = () => {
    if (node.type === "file") {
      onSelect(node.path);
    } else {
      onToggle(node.path);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue && renameValue !== node.name) {
      const parentPath = node.path.slice(0, -node.name.length).replace(/\/$/, "");
      const newPath = parentPath ? `${parentPath}/${renameValue}` : `/${renameValue}`;
      onRename(node.path, newPath);
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setRenameValue(node.name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleRenameCancel();
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-sm py-1 pr-2 text-sm cursor-pointer select-none",
          isSelected && "bg-accent text-accent-foreground",
          !isSelected && "hover:bg-muted"
        )}
        style={{ paddingLeft }}
        onClick={handleSelect}
      >
        {node.type === "directory" ? (
          <button
            onClick={handleToggle}
            className="flex h-4 w-4 items-center justify-center rounded hover:bg-muted-foreground/20"
          >
            {isExpanded ? (
              <FolderOpenIcon className="h-3.5 w-3.5 text-blue-400" />
            ) : (
              <FolderIcon className="h-3.5 w-3.5 text-blue-400" />
            )}
          </button>
        ) : (
          <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}

        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1">
            <Input
              ref={inputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameCancel}
              onKeyDown={handleKeyDown}
              className="h-5 py-0 text-sm"
            />
          </form>
        ) : (
          <span className="flex-1 truncate">{node.name}</span>
        )}

        {/* Hover actions */}
        {!isRenaming && (
          <div className="hidden gap-0.5 group-hover:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="rounded p-0.5 hover:bg-muted-foreground/20"
              title="Rename"
            >
              <Edit2Icon className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.path);
              }}
              className="rounded p-0.5 hover:bg-destructive hover:text-destructive-foreground"
              title="Delete"
            >
              <TrashIcon className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Render children if directory is expanded */}
      {node.type === "directory" && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({
  fs,
  currentPath,
  onFileSelect,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  className,
}: FileExplorerProps) {
  const t = useTranslations("playground");
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => new Set([fs.path]));
  const [isCreating, setIsCreating] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const createInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreating]);

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleSelect = (path: string) => {
    setSelectedPath(path);
    onFileSelect(path);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName) {
      const path = currentPath === "/" ? `/${newFileName}` : `${currentPath}/${newFileName}`;
      onCreateFile(path);
    }
    setNewFileName("");
    setIsCreating(false);
  };

  const handleCreateCancel = () => {
    setNewFileName("");
    setIsCreating(false);
  };

  return (
    <div className={cn("flex h-full flex-col bg-[#252526]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Explorer
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCreating(true)}
          title={t("newFile")}
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-auto py-1">
        {isCreating && (
          <form
            onSubmit={handleCreateSubmit}
            className="flex items-center gap-1 px-2 py-1"
            style={{ paddingLeft: 12 }}
          >
            <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={createInputRef}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={handleCreateCancel}
              placeholder="filename.ts"
              className="h-5 flex-1 py-0 text-sm"
            />
          </form>
        )}

        {fs.children.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            level={0}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onRename={onRenameFile}
            onDelete={onDeleteFile}
          />
        ))}
      </div>

      {/* Current directory indicator */}
      <div className="border-t border-border px-3 py-1.5">
        <span className="truncate text-xs text-muted-foreground" title={currentPath}>
          {currentPath}
        </span>
      </div>
    </div>
  );
}
