"use client";

import { Eye, EyeOff, RefreshCw, Save, Share2, Download, Upload, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusBarProps {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  bottomCollapsed: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  hasTasks: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleBottom: () => void;
  onResetWorkspace: () => void;
  onLoadTemplate: () => void;
  onOpenTemplateGallery: () => void;
  onOpenGithubImport: () => void;
  onExportZip: () => void;
  onShareSnapshot: () => void;
  onCopyShareLink: () => void;
  runnerStatus?: "connected" | "disconnected";
}

export function StatusBar({
  leftCollapsed,
  rightCollapsed,
  bottomCollapsed,
  saveState,
  hasTasks,
  onToggleLeft,
  onToggleRight,
  onToggleBottom,
  onResetWorkspace,
  onLoadTemplate,
  onOpenTemplateGallery,
  onOpenGithubImport,
  onExportZip,
  onShareSnapshot,
  onCopyShareLink,
  runnerStatus = "disconnected",
}: StatusBarProps) {
  return (
    <div className="flex h-9 items-center justify-between border-t border-[#2f2f2f] bg-[#007acc] px-2 text-xs text-white">
      <div className="flex items-center gap-1">
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onToggleLeft}>
          {leftCollapsed ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}Explorer
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onToggleBottom}>
          {bottomCollapsed ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}Terminal
        </Button>
        {hasTasks && (
          <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onToggleRight}>
            {rightCollapsed ? <Eye className="mr-1 h-3 w-3" /> : <EyeOff className="mr-1 h-3 w-3" />}Tasks
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onOpenTemplateGallery}>
          <LayoutTemplate className="mr-1 h-3 w-3" />Templates
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onOpenGithubImport}>
          <Upload className="mr-1 h-3 w-3" />Import
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onExportZip}>
          <Download className="mr-1 h-3 w-3" />Export zip
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onShareSnapshot}>
          <Share2 className="mr-1 h-3 w-3" />Share
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-white hover:bg-[#0d8ae5]" onClick={onCopyShareLink}>
          Copy link
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-white hover:bg-[#0d8ae5]"
          onClick={onLoadTemplate}
        >
          <RefreshCw className="mr-1 h-3 w-3" />Load template
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-white hover:bg-[#0d8ae5]"
          onClick={onResetWorkspace}
        >
          <RefreshCw className="mr-1 h-3 w-3" />Reset
        </Button>
        <span className="inline-flex items-center rounded bg-[#0d8ae5] px-2 py-1 text-[11px]">
          <Save className="mr-1 h-3 w-3" />{saveState}
        </span>
        <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] ${runnerStatus === "connected" ? "bg-emerald-600" : "bg-red-600"}`}>
          Runner: {runnerStatus}
        </span>
      </div>
    </div>
  );
}
