"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type {
  PanelCollapseState,
  SimulationState,
  TaskQuest,
  TaskResult,
  TerminalEntry,
  WorkspaceDefinition,
  WorkspaceState,
} from "@/lib/workbench/types";
import {
  createWorkspaceFromDefinition,
  evaluateQuest,
  executeCommand,
  saveToStorage,
  loadFromStorage,
  deserializeWorkspace,
  setActiveFile,
  closeFile,
  updateSimulationState,
  solanaFundamentalsQuest,
} from "@/lib/workbench";
import { createInitialSimulationState } from "@/lib/workbench/terminal/engine";
import { findNode, normalizeFSPath, updateFileContent, markFileClean } from "@/lib/workbench/fs";
import { FileExplorer } from "./FileExplorer";
import { EditorPane } from "./EditorPane";
import { TerminalPane } from "./TerminalPane";
import { TaskPanel } from "./TaskPanel";

interface WorkbenchShellProps {
  definition?: WorkspaceDefinition;
  quest?: TaskQuest;
  initialEntries?: TerminalEntry[];
  onQuestComplete?: (questId: string, results: TaskResult[]) => void;
  className?: string;
}

const DEFAULT_TERMINAL_ENTRIES: TerminalEntry[] = [
  {
    id: "welcome-1",
    kind: "system",
    text: "Workbench terminal v2 ready. Type 'help' to see available commands.",
    timestamp: Date.now(),
  },
];

export function WorkbenchShell({
  definition,
  quest,
  initialEntries,
  onQuestComplete,
  className,
}: WorkbenchShellProps) {
  // Use default quest if none provided
  const activeQuest = quest ?? solanaFundamentalsQuest;
  const activeDefinition = React.useMemo<WorkspaceDefinition>(() => definition ?? {
    id: "default",
    title: "Default Workspace",
    description: "A default workspace",
    files: [
      {
        path: "README.md",
        content: "# Welcome to Workbench\n\nThis is a simulated development environment.",
        language: "markdown" as const,
      },
    ],
  }, [definition]);

  // Workspace state
  const [workspace, setWorkspace] = React.useState<WorkspaceState>(() =>
    createWorkspaceFromDefinition(activeDefinition)
  );

  // Terminal state
  const [entries, setEntries] = React.useState<TerminalEntry[]>(initialEntries ?? DEFAULT_TERMINAL_ENTRIES);
  const [simulation, setSimulation] = React.useState<SimulationState>(workspace.simulation);

  // Task state
  const [taskCompletions, setTaskCompletions] = React.useState<string[]>([]);
  const [revealedHints, setRevealedHints] = React.useState<Record<string, number>>({});

  // UI state
  const [collapsed, setCollapsed] = React.useState<PanelCollapseState>({
    left: false,
    right: false,
    bottom: false,
  });

  // Load from storage on mount
  React.useEffect(() => {
    const persisted = loadFromStorage();
    if (persisted && persisted.definitionId === activeDefinition.id) {
      try {
        const { workspace: loadedWorkspace, taskCompletions: loadedCompletions, revealedHints: loadedHints } =
          deserializeWorkspace(persisted, activeDefinition);
        setWorkspace(loadedWorkspace);
        setSimulation(loadedWorkspace.simulation);
        setTaskCompletions(loadedCompletions);
        setRevealedHints(loadedHints);
        setEntries((prev) => [
          ...prev,
          {
            id: `load-${Date.now()}`,
            kind: "system",
            text: "Loaded saved workspace state.",
            timestamp: Date.now(),
          },
        ]);
      } catch {
        // If loading fails, use default
      }
    }
  }, [activeDefinition.id]);

  // Save to storage when state changes
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      saveToStorage(workspace, taskCompletions, revealedHints);
    }, 500);
    return () => clearTimeout(timeout);
  }, [workspace, taskCompletions, revealedHints]);

  // Evaluate tasks
  const taskResults = React.useMemo(() => {
    const context = {
      workspace,
      simulation,
      fs: workspace.fs,
      checkpoints: taskCompletions,
    };
    return evaluateQuest(activeQuest, context, taskCompletions);
  }, [workspace, simulation, activeQuest, taskCompletions]);

  // Check quest completion
  const previousResultsRef = React.useRef<TaskResult[]>([]);
  React.useEffect(() => {
    const prev = previousResultsRef.current;
    const allComplete = taskResults.length > 0 && taskResults.every((r) => r.complete);
    const wasComplete = prev.length > 0 && prev.every((r) => r.complete);

    if (allComplete && !wasComplete) {
      onQuestComplete?.(activeQuest.id, taskResults);
      setEntries((prev) => [
        ...prev,
        {
          id: `complete-${Date.now()}`,
          kind: "system",
          text: `🎉 Quest completed: ${activeQuest.title}`,
          timestamp: Date.now(),
        },
      ]);
    }

    // Update task completions
    const completedIds = taskResults.filter((r) => r.complete).map((r) => r.taskId);
    if (JSON.stringify(completedIds) !== JSON.stringify(taskCompletions)) {
      setTaskCompletions(completedIds);
    }

    previousResultsRef.current = taskResults;
  }, [taskResults, activeQuest.id, activeQuest.title, onQuestComplete, taskCompletions]);

  // Command execution
  const handleExecuteCommand = React.useCallback(
    async (command: string) => {
      // Add input entry
      setEntries((prev) => [
        ...prev,
        {
          id: `input-${Date.now()}`,
          kind: "input",
          text: `$ ${command}`,
          timestamp: Date.now(),
        },
      ]);

      // Execute command
      const result = await executeCommand(command, simulation, workspace.fs);

      // Update simulation state
      setSimulation(result.nextState);
      setWorkspace((prev) => updateSimulationState(prev, result.nextState));

      // Handle output
      if (result.shouldClear) {
        setEntries([]);
      } else if (result.lines.length > 0) {
        setEntries((prev) => [
          ...prev,
          ...result.lines.map((line, i) => ({
            id: `output-${Date.now()}-${i}`,
            kind: line.kind,
            text: line.text,
            timestamp: Date.now(),
          })),
        ]);
      }
    },
    [simulation, workspace.fs]
  );

  // File operations
  const handleFileSelect = React.useCallback((path: string) => {
    const normalized = normalizeFSPath(path);
    setWorkspace((prev) => setActiveFile(prev, normalized));
  }, []);

  const handleFileClose = React.useCallback((path: string) => {
    const normalized = normalizeFSPath(path);
    setWorkspace((prev) => closeFile(prev, normalized));
  }, []);

  const handleFileContentChange = React.useCallback((path: string, content: string) => {
    const normalized = normalizeFSPath(path);
    const node = findNode(workspace.fs, normalized);
    if (node && node.type === "file") {
      updateFileContent(workspace.fs, normalized, content);
      setWorkspace((prev) => ({ ...prev, updatedAt: Date.now() }));
    }
  }, [workspace.fs]);

  const handleFileSave = React.useCallback((path: string) => {
    const normalized = normalizeFSPath(path);
    markFileClean(workspace.fs, normalized);
    setWorkspace((prev) => ({ ...prev, updatedAt: Date.now() }));
  }, [workspace.fs]);

  // File explorer operations
  const handleCreateFile = React.useCallback((path: string) => {
    const normalized = normalizeFSPath(path);
    const file = findNode(workspace.fs, normalized);
    if (!file) {
      // Create new file in FS
      // This would need to be implemented in the FS module
      setEntries((prev) => [
        ...prev,
        {
          id: `create-${Date.now()}`,
          kind: "system",
          text: `Created file: ${path}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [workspace.fs]);

  const handleRenameFile = React.useCallback((oldPath: string, newPath: string) => {
    // Implementation would go here
    setEntries((prev) => [
      ...prev,
      {
        id: `rename-${Date.now()}`,
        kind: "system",
        text: `Renamed ${oldPath} to ${newPath}`,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleDeleteFile = React.useCallback((path: string) => {
    // Implementation would go here
    setEntries((prev) => [
      ...prev,
      {
        id: `delete-${Date.now()}`,
        kind: "system",
        text: `Deleted: ${path}`,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Task panel operations
  const handleRevealHint = React.useCallback((taskId: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] ?? 0) + 1,
    }));
  }, []);

  // Reset workspace
  const handleReset = React.useCallback(() => {
    setWorkspace(createWorkspaceFromDefinition(activeDefinition));
    setSimulation(createInitialSimulationState());
    setTaskCompletions([]);
    setRevealedHints({});
    setEntries(DEFAULT_TERMINAL_ENTRIES);
  }, [activeDefinition]);

  // Toggle panels
  const togglePanel = React.useCallback((panel: keyof PanelCollapseState) => {
    setCollapsed((prev) => ({ ...prev, [panel]: !prev[panel] }));
  }, []);

  // Get active file content
  const activeFileNode = workspace.activeFilePath
    ? findNode(workspace.fs, workspace.activeFilePath)
    : null;
  const activeFileContent = activeFileNode?.type === "file" ? activeFileNode.content : "";

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-4rem)] min-h-[600px] w-full overflow-hidden rounded-lg border border-border bg-[#1e1e1e] text-foreground",
        className
      )}
    >
      {/* Left panel - File Explorer */}
      {!collapsed.left && (
        <div className="w-64 flex-shrink-0 border-r border-border">
          <FileExplorer
            fs={workspace.fs}
            currentPath={workspace.currentDirectory}
            onFileSelect={handleFileSelect}
            onCreateFile={handleCreateFile}
            onRenameFile={handleRenameFile}
            onDeleteFile={handleDeleteFile}
          />
        </div>
      )}

      {/* Center panel - Editor + Terminal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Editor */}
        <div className="flex-1 min-h-0">
          <EditorPane
            workspace={workspace}
            activeFilePath={workspace.activeFilePath}
            activeFileContent={activeFileContent}
            onContentChange={handleFileContentChange}
            onFileSelect={handleFileSelect}
            onFileClose={handleFileClose}
            onFileSave={handleFileSave}
          />
        </div>

        {/* Bottom panel - Terminal */}
        {!collapsed.bottom && (
          <div className="h-48 border-t border-border">
            <TerminalPane
              entries={entries}
              commandHistory={simulation.commandHistory}
              currentDirectory={workspace.currentDirectory}
              onExecuteCommand={handleExecuteCommand}
            />
          </div>
        )}
      </div>

      {/* Right panel - Task Panel */}
      {!collapsed.right && (
        <div className="w-80 flex-shrink-0 border-l border-border">
          <TaskPanel
            quest={activeQuest}
            results={taskResults}
            revealedHintsByTask={revealedHints}
            onRevealHint={handleRevealHint}
            onReset={handleReset}
            simulation={simulation}
          />
        </div>
      )}

      {/* Panel toggle buttons (visible when panels are collapsed) */}
      <div className="absolute bottom-2 left-2 flex gap-1">
        <button
          onClick={() => togglePanel("left")}
          className={cn(
            "rounded bg-muted px-2 py-1 text-xs font-medium hover:bg-muted/80",
            collapsed.left && "bg-primary text-primary-foreground"
          )}
          title="Toggle file explorer"
        >
          Files
        </button>
        <button
          onClick={() => togglePanel("bottom")}
          className={cn(
            "rounded bg-muted px-2 py-1 text-xs font-medium hover:bg-muted/80",
            collapsed.bottom && "bg-primary text-primary-foreground"
          )}
          title="Toggle terminal"
        >
          Terminal
        </button>
        <button
          onClick={() => togglePanel("right")}
          className={cn(
            "rounded bg-muted px-2 py-1 text-xs font-medium hover:bg-muted/80",
            collapsed.right && "bg-primary text-primary-foreground"
          )}
          title="Toggle task panel"
        >
          Tasks
        </button>
      </div>
    </div>
  );
}
