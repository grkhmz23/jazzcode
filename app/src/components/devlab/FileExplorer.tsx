"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder, FolderOpen } from "lucide-react";
import { useDevLabStore } from "@/lib/devlab/store";
import { VFSNode } from "@/lib/devlab/types";

function iconFor(path: string) {
  if (path.endsWith(".rs")) return <FileCode2 className="h-3.5 w-3.5 text-[#CE422B]" />;
  if (path.endsWith(".toml")) return <FileText className="h-3.5 w-3.5 text-[#a0a0a0]" />;
  if (path.endsWith(".ts")) return <FileCode2 className="h-3.5 w-3.5 text-[#3178C6]" />;
  if (path.endsWith(".json")) return <FileJson className="h-3.5 w-3.5 text-[#F5C518]" />;
  if (path.endsWith(".md")) return <FileText className="h-3.5 w-3.5 text-[#ffffff]" />;
  return <FileText className="h-3.5 w-3.5 text-[#cccccc]" />;
}

type MenuState = {
  x: number;
  y: number;
  path: string;
} | null;

function getNode(root: VFSNode, path: string): VFSNode | null {
  const parts = path.split("/").filter(Boolean);
  let current: VFSNode = root;
  for (const part of parts) {
    if (current.type !== "directory") return null;
    const next = current.children?.[part];
    if (!next) return null;
    current = next;
  }
  return current;
}

export function FileExplorer() {
  const vfs = useDevLabStore((state) => state.vfs);
  const openFile = useDevLabStore((state) => state.openFile);
  const createVfsFile = useDevLabStore((state) => state.createVfsFile);
  const createVfsDir = useDevLabStore((state) => state.createVfsDir);
  const deleteVfsNode = useDevLabStore((state) => state.deleteVfsNode);
  const activeFile = useDevLabStore((state) => state.activeFile);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [menu, setMenu] = useState<MenuState>(null);

  const root = useMemo(() => getNode(vfs, "/my-solana-project"), [vfs]);

  if (!root || root.type !== "directory") {
    return <div className="h-full bg-[#252526] p-3 text-xs text-[#c5c5c5]">No files loaded</div>;
  }

  const toggle = (path: string) => {
    setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const createPath = (dirPath: string, name: string, isDir: boolean) => {
    const target = `${dirPath}/${name}`.replace(/^\//, "");
    if (isDir) {
      createVfsDir(target);
    } else {
      createVfsFile(target);
      openFile(target);
    }
  };

  const renderNode = (node: VFSNode, parentPath: string) => {
    if (node.type !== "directory") return null;
    const entries = Object.values(node.children ?? {}).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });

    return entries.map((child) => {
      const path = `${parentPath}/${child.name}`;
      if (child.type === "directory") {
        const isCollapsed = collapsed[path] ?? false;
        return (
          <div key={path}>
            <button
              type="button"
              className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs text-[#cccccc] hover:bg-[#2a2d2e]"
              onClick={() => toggle(path)}
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({ x: event.clientX, y: event.clientY, path });
              }}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {isCollapsed ? <Folder className="h-3.5 w-3.5 text-[#dcb67a]" /> : <FolderOpen className="h-3.5 w-3.5 text-[#dcb67a]" />}
              <span className="truncate">{child.name}</span>
            </button>
            {!isCollapsed && <div className="pl-4">{renderNode(child, path)}</div>}
          </div>
        );
      }

      const selected = activeFile === path.replace(/^\//, "");
      return (
        <button
          type="button"
          key={path}
          className={`flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs hover:bg-[#2a2d2e] ${
            selected ? "bg-[#37373d]" : ""
          } ${child.modified ? "font-semibold" : "font-normal"}`}
          onClick={() => openFile(path.replace(/^\//, ""))}
          onContextMenu={(event) => {
            event.preventDefault();
            setMenu({ x: event.clientX, y: event.clientY, path });
          }}
        >
          <span>{iconFor(path)}</span>
          <span className="truncate text-[#d4d4d4]">{child.name}</span>
        </button>
      );
    });
  };

  return (
    <div className="relative h-full overflow-auto bg-[#252526] py-2" onClick={() => setMenu(null)}>
      <div className="px-3 pb-2 text-[11px] uppercase tracking-wide text-[#8a8a8a]">Explorer</div>
      {renderNode(root, "/my-solana-project")}

      {menu && (
        <div
          className="fixed z-50 w-40 rounded border border-[#3d3d3d] bg-[#252526] p-1 text-xs text-[#d4d4d4] shadow-lg"
          style={{ left: menu.x, top: menu.y }}
        >
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left hover:bg-[#37373d]"
            onClick={() => {
              const name = window.prompt("New file name");
              if (name) createPath(menu.path, name, false);
              setMenu(null);
            }}
          >
            New File
          </button>
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left hover:bg-[#37373d]"
            onClick={() => {
              const name = window.prompt("New folder name");
              if (name) createPath(menu.path, name, true);
              setMenu(null);
            }}
          >
            New Folder
          </button>
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left text-[#f48771] hover:bg-[#37373d]"
            onClick={() => {
              deleteVfsNode(menu.path.replace(/^\//, ""));
              setMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
