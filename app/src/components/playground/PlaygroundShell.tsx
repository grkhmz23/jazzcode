"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import { EditorPane } from "@/components/playground/EditorPane";
import { FileExplorer } from "@/components/playground/FileExplorer";
import { PlaygroundTopBar } from "@/components/playground/PlaygroundTopBar";
import { QuickOpenPalette } from "@/components/playground/QuickOpenPalette";
import { StatusBar } from "@/components/playground/StatusBar";
import { TaskPanel } from "@/components/playground/TaskPanel";
import { TerminalPane } from "@/components/playground/TerminalPane";
import { WelcomeScreen } from "@/components/playground/WelcomeScreen";
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
import {
  Achievement,
  applySuggestion,
  clearBurnerWalletInIndexedDb,
  clearWorkspaceInIndexedDb,
  createFile,
  createInitialTerminalState,
  createWorkspaceFromTemplate,
  deserializeSnapshot,
  downloadSingleFile,
  downloadWorkspaceZip,
  emptyWorkspaceTemplate,
  evaluateAchievements,
  evaluateQuest,
  executeTerminalCommand,
  formatDuration,
  getAutocompleteSuggestions,
  getMission,
  getSpeedrunTimeMs,
  getTemplateByIdV2,
  importGitHubRepositoryServer,
  ImportProgress,
  listTree,
  loadBurnerWalletFromIndexedDb,
  loadQuestProgressFromIndexedDb,
  loadWorkspaceFromIndexedDb,
  maybeStartSpeedrun,
  playgroundTemplatesV2,
  QuestCompleteEvent,
  questEventEmitter,
  saveBurnerWalletToIndexedDb,
  saveQuestProgressToIndexedDb,
  saveWorkspaceToIndexedDb,
  serializeSnapshot,
  stopSpeedrun,
  toggleSpeedrun,
  updateFileContent,
  workspaceReducer,
  WorkspaceMode,
} from "@/lib/playground";
import { useKeyboardShortcuts } from "@/lib/playground/hooks/use-keyboard-shortcuts";
import { TaskResult } from "@/lib/playground/tasks/types";
import { Workspace, WorkspaceFile } from "@/lib/playground/types";

interface PlaygroundShellProps {
  onQuestComplete?: (event: QuestCompleteEvent) => void;
}

type SaveState = "idle" | "saving" | "saved" | "error";
type ConfirmAction = "reset" | "template" | null;

function makeTerminalEntry(kind: "input" | "output" | "system" | "error", text: string) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    kind,
    text,
    timestamp: Date.now(),
  };
}

const DEFAULT_TERMINAL_ENTRIES = [
  makeTerminalEntry("system", "Playground terminal v2 ready. Run `help` to list commands."),
];

export function PlaygroundShell({ onQuestComplete }: PlaygroundShellProps) {
  const [workspace, dispatch] = useReducer(
    workspaceReducer,
    emptyWorkspaceTemplate,
    createWorkspaceFromTemplate
  );
  const [mode, setMode] = useState<WorkspaceMode>({ type: "standalone" });
  const [showWelcome, setShowWelcome] = useState(false);
  const [terminalState, setTerminalState] = useState(createInitialTerminalState);
  const [terminalEntries, setTerminalEntries] = useState(DEFAULT_TERMINAL_ENTRIES);
  const [revealedHintsByTask, setRevealedHintsByTask] = useState<Record<string, number>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [ready, setReady] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importRepo, setImportRepo] = useState("");
  const [importBranch, setImportBranch] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [gitTokenDialogOpen, setGitTokenDialogOpen] = useState(false);
  const [gitTokenInput, setGitTokenInput] = useState("");
  const gitTokenResolveRef = useRef<((token: string | null) => void) | null>(null);
  const [walletMode, setWalletMode] = useState<"burner" | "external">("burner");
  const [burnerWallet, setBurnerWallet] = useState<{ publicKey: string; secretKey: number[] } | null>(null);
  const [balanceLabel, setBalanceLabel] = useState("Balance: --");
  const [speedrunState, setSpeedrunState] = useState(() => ({
    enabled: false,
    running: false,
    startedAt: null as number | null,
    endedAt: null as number | null,
  }));
  const [clockTick, setClockTick] = useState(Date.now());
  const [realRpcUsed, setRealRpcUsed] = useState(false);
  const [persistedAchievements, setPersistedAchievements] = useState<string[]>([]);
  const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);
  const [, setCheckpointSnapshots] = useState<Record<string, string>>({});
  const [quickOpenOpen, setQuickOpenOpen] = useState(false);

  const emittedQuestRef = useRef(false);
  const checkpointRef = useRef<string[]>([]);
  const workspaceRef = useRef(workspace);
  const terminalRef = useRef(terminalState);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { connection } = useConnection();
  const { publicKey, connected, disconnect, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  const activeQuest = mode.type === "mission" ? mode.quest : null;
  const hasTasks = mode.type === "mission";

  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  useEffect(() => {
    terminalRef.current = terminalState;
  }, [terminalState]);

  const activeTemplate = useMemo(() => {
    const byWorkspace = getTemplateByIdV2(workspace.templateId);
    return byWorkspace ?? emptyWorkspaceTemplate;
  }, [workspace.templateId]);

  const tree = useMemo(() => listTree(workspace), [workspace]);

  const checkpoints = useMemo(() => {
    if (!activeQuest) return [];

    const completeTaskIds = new Set<string>();
    const contextResults = evaluateQuest(activeQuest, {
      workspace,
      terminalState,
      checkpoints: [],
    });
    contextResults.forEach((result) => {
      if (result.complete) {
        completeTaskIds.add(result.taskId);
      }
    });

    return activeQuest.tasks
      .filter((task) => task.checkpointId && completeTaskIds.has(task.id))
      .map((task) => task.checkpointId as string);
  }, [workspace, terminalState, activeQuest]);

  const taskResults: TaskResult[] = useMemo(() => {
    if (!activeQuest) return [];
    return evaluateQuest(activeQuest, {
      workspace,
      terminalState,
      checkpoints,
    });
  }, [workspace, terminalState, checkpoints, activeQuest]);

  const speedrunTimeMs = useMemo(() => getSpeedrunTimeMs(speedrunState, clockTick), [speedrunState, clockTick]);

  const dynamicAchievements = useMemo(
    () =>
      evaluateAchievements({
        terminal: terminalState,
        tasks: taskResults,
        realRpcUsed,
        speedrunTimeMs,
      }),
    [terminalState, taskResults, realRpcUsed, speedrunTimeMs]
  );

  const achievements: Achievement[] = useMemo(() => {
    const map = new Map<string, Achievement>();
    dynamicAchievements.forEach((item) => map.set(item.id, item));
    persistedAchievements.forEach((id) => {
      if (!map.has(id)) {
        map.set(id, {
          id,
          label: id,
          description: "Persisted achievement",
        });
      }
    });
    return Array.from(map.values());
  }, [dynamicAchievements, persistedAchievements]);

  useEffect(() => {
    if (!speedrunState.running) {
      return;
    }
    const timer = setInterval(() => setClockTick(Date.now()), 100);
    return () => clearInterval(timer);
  }, [speedrunState.running]);

  useEffect(() => {
    const previous = new Set(checkpointRef.current);
    const additions = checkpoints.filter((id) => !previous.has(id));
    if (additions.length === 0) {
      checkpointRef.current = checkpoints;
      return;
    }

    void serializeSnapshot(workspaceRef.current).then((snapshot) => {
      setCheckpointSnapshots((current) => {
        const next = { ...current };
        additions.forEach((id) => {
          next[id] = snapshot;
        });
        return next;
      });
    });
    checkpointRef.current = checkpoints;
  }, [checkpoints]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const snapshot = params.get("w");
        const shareId = params.get("share");
        const missionParam = params.get("mission");

        // Detect mission mode
        if (missionParam) {
          const descriptor = getMission(missionParam);
          if (descriptor) {
            setMode({
              type: "mission",
              questId: descriptor.questId,
              quest: descriptor.quest,
              template: descriptor.template,
            });
            // Load mission template as default unless saved workspace exists
            const saved = await loadWorkspaceFromIndexedDb();
            if (saved && mounted) {
              dispatch({ type: "load", workspace: saved });
              setTerminalEntries((previous) => [
                ...previous,
                makeTerminalEntry("system", "Loaded saved workspace from IndexedDB."),
              ]);
            } else if (mounted) {
              dispatch({ type: "load_template", template: descriptor.template });
              setTerminalEntries((previous) => [
                ...previous,
                makeTerminalEntry("system", `Mission loaded: ${descriptor.quest.title}`),
              ]);
            }

            // Load quest progress
            const progress = await loadQuestProgressFromIndexedDb(descriptor.questId);
            if (mounted && progress) {
              setPersistedAchievements(progress.achievements);
              setBestTimeMs(progress.speedrunBestMs);
            }
          } else if (mounted) {
            setTerminalEntries((previous) => [
              ...previous,
              makeTerminalEntry("error", `Unknown mission: ${missionParam}`),
            ]);
          }
        } else if (shareId) {
          // Load from share API
          const response = await fetch(`/api/playground/share/${shareId}`);
          if (!response.ok) {
            throw new Error("Share not found or expired");
          }
          const { bundle } = await response.json();

          // Convert bundle files to workspace format
          const files: Record<string, WorkspaceFile> = {};
          bundle.files.forEach((file: { path: string; content: string; language: string }) => {
            files[file.path] = {
              path: file.path,
              content: file.content,
              language: file.language as WorkspaceFile["language"],
              updatedAt: Date.now(),
            };
          });

          // Add demo page if not present
          const demoPath = "page.tsx";
          if (!files[demoPath]) {
            const importName = bundle.title.replace(/\s+/g, "");
            const firstFile = bundle.files[0];
            const componentName = firstFile ? firstFile.path.replace(/\.tsx?$/, "").replace(/\//g, "_") : "Component";

            files[demoPath] = {
              path: demoPath,
              content: `import { ${importName} } from "./${componentName}";

export default function Demo() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold text-white">${bundle.title} Demo</h1>
        <${importName} {...${JSON.stringify(bundle.defaultProps || {})}} />
      </div>
    </div>
  );
}`,
              language: "typescript",
              updatedAt: Date.now(),
            };
          }

          const workspaceFromShare: Workspace = {
            templateId: `share-${shareId}`,
            files,
            openFiles: Object.keys(files),
            activeFile: Object.keys(files)[0] || "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          if (mounted) {
            dispatch({ type: "load", workspace: workspaceFromShare });
            setTerminalEntries((previous) => [
              ...previous,
              makeTerminalEntry("system", `Loaded component: ${bundle.title}`),
              makeTerminalEntry("system", `Files: ${bundle.files.length}`),
            ]);
          }
        } else if (snapshot) {
          const fromUrl = await deserializeSnapshot(snapshot);
          if (fromUrl && mounted) {
            dispatch({ type: "load", workspace: fromUrl });
            setTerminalEntries((previous) => [
              ...previous,
              makeTerminalEntry("system", "Loaded workspace from share snapshot URL."),
            ]);
          }
        } else {
          const saved = await loadWorkspaceFromIndexedDb();
          if (saved && mounted) {
            dispatch({ type: "load", workspace: saved });
            setTerminalEntries((previous) => [
              ...previous,
              makeTerminalEntry("system", "Loaded saved workspace from IndexedDB."),
            ]);
          } else if (mounted) {
            // No saved workspace, no mission, no share — show welcome
            setShowWelcome(true);
          }
        }

        const burner = await loadBurnerWalletFromIndexedDb();
        if (mounted && burner) {
          setBurnerWallet({
            publicKey: burner.publicKey,
            secretKey: burner.secretKey,
          });
        }
      } catch (error) {
        if (mounted) {
          const message = error instanceof Error ? error.message : "Failed to load persisted playground state.";
          setTerminalEntries((previous) => [...previous, makeTerminalEntry("error", message)]);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    setSaveState("saving");
    const timer = setTimeout(() => {
      void saveWorkspaceToIndexedDb(workspace)
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("error"));
    }, 500);

    return () => clearTimeout(timer);
  }, [workspace, ready]);

  useEffect(() => {
    if (!activeQuest) return;

    const allComplete = taskResults.length > 0 && taskResults.every((item) => item.complete);
    if (!allComplete || emittedQuestRef.current) {
      return;
    }

    emittedQuestRef.current = true;

    const ended = stopSpeedrun(speedrunState, Date.now());
    setSpeedrunState(ended);
    const timeMs = getSpeedrunTimeMs(ended, Date.now());
    void serializeSnapshot(workspaceRef.current).then((snapshotValue) => {
      const url = `${window.location.origin}${window.location.pathname}?w=${snapshotValue}`;
      const event: QuestCompleteEvent = {
        questId: activeQuest.id,
        timeMs,
        achievements,
        snapshotUrl: url,
      };

      questEventEmitter.emitQuestComplete(event);
      onQuestComplete?.(event);
    });

    const nextBest = bestTimeMs === null || (timeMs !== null && timeMs < bestTimeMs) ? timeMs : bestTimeMs;
    if (nextBest !== bestTimeMs) {
      setBestTimeMs(nextBest);
    }

    void saveQuestProgressToIndexedDb({
      questId: activeQuest.id,
      speedrunBestMs: nextBest,
      achievements: achievements.map((entry) => entry.id),
      completions: 1,
      updatedAt: Date.now(),
    });
  }, [taskResults, speedrunState, workspaceRef, achievements, onQuestComplete, bestTimeMs, activeQuest]);

  const createOrUpdateFileInWorkspace = (current: Workspace, path: string, content: string): Workspace => {
    if (current.files[path]) {
      return updateFileContent(current, path, content);
    }
    const withFile = createFile(current, path);
    return updateFileContent(withFile, path, content);
  };

  const runCommand = async (command: string) => {
    const started = maybeStartSpeedrun(speedrunState, Date.now());
    if (started !== speedrunState) {
      setSpeedrunState(started);
    }

    let pendingWorkspace = workspaceRef.current;

    const io = {
      workspace: pendingWorkspace,
      createOrUpdateFile: (path: string, content: string) => {
        pendingWorkspace = createOrUpdateFileInWorkspace(pendingWorkspace, path, content);
      },
      fileExists: (path: string) => Boolean(pendingWorkspace.files[path]),
      readFile: (path: string) => pendingWorkspace.files[path]?.content ?? null,
      listPaths: () => Object.keys(pendingWorkspace.files),
      setActiveFile: (path: string) => {
        if (pendingWorkspace.files[path]) {
          pendingWorkspace = {
            ...pendingWorkspace,
            openFiles: pendingWorkspace.openFiles.includes(path)
              ? pendingWorkspace.openFiles
              : [...pendingWorkspace.openFiles, path],
            activeFile: path,
          };
        }
      },
      deleteFile: (path: string) => {
        if (pendingWorkspace.files[path] && Object.keys(pendingWorkspace.files).length > 1) {
          const nextFiles = { ...pendingWorkspace.files };
          delete nextFiles[path];
          pendingWorkspace = {
            ...pendingWorkspace,
            files: nextFiles,
            openFiles: pendingWorkspace.openFiles.filter((p) => p !== path),
            updatedAt: Date.now(),
          };
        }
      },
      requestGitToken: () =>
        new Promise<string | null>((resolve) => {
          gitTokenResolveRef.current = resolve;
          setGitTokenDialogOpen(true);
        }),
      wallet: {
        mode: walletMode,
        burnerAddress: burnerWallet?.publicKey ?? null,
        externalAddress: publicKey?.toBase58() ?? null,
        burnerSigner: burnerWallet
          ? {
              publicKey: burnerWallet.publicKey,
              secretKey: Uint8Array.from(burnerWallet.secretKey),
            }
          : null,
        externalConnected: connected,
        sendExternalTransaction:
          connected && publicKey
            ? async (recipient: string, lamports: number): Promise<string> => {
                const transaction = new Transaction().add(
                  SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports,
                  })
                );
                const signature = await sendTransaction(transaction, connection as Connection);
                await connection.confirmTransaction(signature, "confirmed");
                return signature;
              }
            : undefined,
      },
    };

    setTerminalEntries((previous) => [...previous, makeTerminalEntry("input", `$ ${command}`)]);

    try {
      const result = await executeTerminalCommand(command, terminalRef.current, io);

      if (result.shouldClear) {
        setTerminalEntries([]);
      }

      if (result.lines.length > 0) {
        setTerminalEntries((previous) => [
          ...previous,
          ...result.lines.map((line) => makeTerminalEntry(line.kind, line.text)),
        ]);
      }

      let nextTerminalState = result.nextState;
      if (result.metadata?.commandSucceeded) {
        nextTerminalState = {
          ...nextTerminalState,
          commandSuccesses: [...nextTerminalState.commandSuccesses, result.metadata.commandSucceeded],
        };
      }
      setTerminalState(nextTerminalState);
      terminalRef.current = nextTerminalState;

      if (result.metadata?.realRpcUsed) {
        setRealRpcUsed(true);
      }

      if (pendingWorkspace !== workspaceRef.current) {
        dispatch({ type: "load", workspace: pendingWorkspace });
        workspaceRef.current = pendingWorkspace;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terminal command failed.";
      setTerminalEntries((previous) => [...previous, makeTerminalEntry("error", message)]);
    }
  };

  const handleRefreshBalance = async () => {
    const target = walletMode === "external" ? publicKey?.toBase58() ?? null : burnerWallet?.publicKey ?? null;
    if (!target) {
      setBalanceLabel("Balance: wallet unavailable");
      return;
    }

    try {
      const lamports = await connection.getBalance(new PublicKey(target), "confirmed");
      setBalanceLabel(`Balance: ${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL (devnet)`);
      setRealRpcUsed(true);
    } catch {
      const simulated = terminalRef.current.simulatedBalances[target] ?? 0;
      setBalanceLabel(`Balance: ${simulated.toFixed(4)} SOL (simulated)`);
    }
  };

  const handleCreateBurner = () => {
    const generated = Keypair.generate();
    const record = {
      publicKey: generated.publicKey.toBase58(),
      secretKey: Array.from(generated.secretKey),
    };
    setBurnerWallet(record);
    setWalletMode("burner");
    void saveBurnerWalletToIndexedDb({
      publicKey: record.publicKey,
      secretKey: record.secretKey,
      createdAt: Date.now(),
    });

    setTerminalEntries((previous) => [
      ...previous,
      makeTerminalEntry("system", `Burner wallet created: ${record.publicKey}`),
    ]);
  };

  const handleExportBurner = () => {
    if (!burnerWallet) {
      return;
    }
    const blob = new Blob([JSON.stringify(burnerWallet.secretKey, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "burner-wallet.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetBurner = () => {
    setBurnerWallet(null);
    void clearBurnerWalletInIndexedDb();
  };

  const handleShareSnapshot = async () => {
    const encoded = await serializeSnapshot(workspaceRef.current);
    const next = `${window.location.pathname}?w=${encoded}`;
    window.history.replaceState({}, "", next);
    toast.success("Snapshot added to URL");
  };

  const handleCopyShareLink = async () => {
    const encoded = await serializeSnapshot(workspaceRef.current);
    const link = `${window.location.origin}${window.location.pathname}?w=${encoded}`;
    await navigator.clipboard.writeText(link);
    toast.success("Share link copied");
  };

  const handleExportZip = () => {
    try {
      downloadWorkspaceZip(workspaceRef.current);
      toast.success("Workspace exported as zip");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed";
      toast.error(message);
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = getTemplateByIdV2(templateId);
    if (!template) {
      return;
    }

    dispatch({ type: "load_template", template });
    setTerminalEntries((previous) => [
      ...previous,
      makeTerminalEntry("system", `Template loaded: ${template.title}`),
    ]);
  };

  const resetWorkspace = () => {
    const template = mode.type === "mission" ? mode.template : emptyWorkspaceTemplate;
    dispatch({ type: "load_template", template });
    setTerminalState(createInitialTerminalState());
    setTerminalEntries(DEFAULT_TERMINAL_ENTRIES);
    setRevealedHintsByTask({});
    emittedQuestRef.current = false;
    setRealRpcUsed(false);
    void clearWorkspaceInIndexedDb();
  };

  const handleImportGithub = async () => {
    setImportBusy(true);
    setImportProgress({ total: 1, completed: 0, currentFile: "Starting import..." });
    try {
      const template = await importGitHubRepositoryServer(importRepo, importBranch || undefined, {
        onProgress: (progress) => setImportProgress(progress),
      });
      dispatch({ type: "load_template", template });
      setImportModalOpen(false);
      setImportRepo("");
      setImportBranch("");
      setShowWelcome(false);
      toast.success(`GitHub repository imported: ${template.files.length} files`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "GitHub import failed";
      toast.error(message);
    } finally {
      setImportBusy(false);
      setImportProgress(null);
    }
  };

  const onConfirmAction = () => {
    if (!confirmAction) {
      return;
    }

    if (confirmAction === "reset") {
      resetWorkspace();
      setConfirmAction(null);
      return;
    }

    loadTemplate(activeTemplate.id);
    setConfirmAction(null);
  };

  const handleExportCurrentFile = () => {
    const path = workspace.activeFile;
    const file = workspace.files[path];
    if (file) {
      downloadSingleFile(path, file.content);
    }
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  const shortcutHandlers = useMemo(
    () => ({
      save: () => void saveWorkspaceToIndexedDb(workspaceRef.current),
      quickOpen: () => setQuickOpenOpen((p) => !p),
      focusTerminal: () => terminalInputRef.current?.focus(),
    }),
    []
  );
  useKeyboardShortcuts(shortcutHandlers);

  const rightColumnWidth = hasTasks && !rightCollapsed ? 340 : 0;
  const gridColumns = `${leftCollapsed ? 0 : 260}px 1fr ${rightColumnWidth}px`;
  const gridColumnSpan = hasTasks ? "1 / 4" : "1 / 3";
  const terminalColumnSpan = hasTasks ? "1 / 3" : "1 / 3";
  const terminalHeight = bottomCollapsed ? 0 : 220;

  if (showWelcome) {
    return (
      <div className="h-[calc(100vh-10rem)] min-h-[680px] w-full rounded-lg border border-[#2f2f2f] bg-[#1e1e1e] text-[#d4d4d4]">
        <WelcomeScreen
          templates={playgroundTemplatesV2}
          onSelectTemplate={(template) => {
            dispatch({ type: "load_template", template });
            dismissWelcome();
          }}
          onNewEmpty={() => {
            dispatch({ type: "load_template", template: emptyWorkspaceTemplate });
            dismissWelcome();
          }}
          onOpenGithubImport={() => {
            dismissWelcome();
            setImportModalOpen(true);
          }}
          onOpenFileUpload={() => {
            dismissWelcome();
            fileInputRef.current?.click();
          }}
        />
        {/* Hidden file input for welcome screen upload */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              // Convert files to workspace format inline
              const fileList = e.target.files;
              const now = Date.now();
              const files: Record<string, WorkspaceFile> = {};
              const promises = Array.from(fileList).map(async (file) => {
                const content = await file.text();
                const path = file.name;
                const { inferLanguageFromPath } = await import("@/lib/playground/workspace");
                files[path] = {
                  path,
                  language: inferLanguageFromPath(path),
                  content,
                  updatedAt: now,
                };
              });
              void Promise.all(promises).then(() => {
                dispatch({ type: "import_files", files });
              });
            }
            e.target.value = "";
          }}
        />

        {/* GitHub import dialog available from welcome screen */}
        <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Public GitHub Repo</DialogTitle>
              <DialogDescription>Supports owner/repo or full URL. Imports files as read-only.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={importRepo}
                onChange={(event) => setImportRepo(event.target.value)}
                placeholder="solana-labs/solana-program-library"
                aria-label="GitHub repository"
                disabled={importBusy}
              />
              <Input
                value={importBranch}
                onChange={(event) => setImportBranch(event.target.value)}
                placeholder="Branch (optional, defaults to HEAD)"
                aria-label="GitHub branch"
                disabled={importBusy}
              />
              {importProgress && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Downloading files...</span>
                    <span>
                      {importProgress.completed} / {importProgress.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${importProgress.total > 0 ? (importProgress.completed / importProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  {importProgress.currentFile && (
                    <p className="truncate text-xs text-muted-foreground">{importProgress.currentFile}</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setImportModalOpen(false)} disabled={importBusy}>
                Cancel
              </Button>
              <Button type="button" onClick={() => void handleImportGithub()} disabled={importBusy || !importRepo.trim()}>
                {importBusy ? "Importing..." : "Import"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[680px] w-full rounded-lg border border-[#2f2f2f] bg-[#1e1e1e] text-[#d4d4d4]">
      <QuickOpenPalette
        open={quickOpenOpen}
        filePaths={Object.keys(workspace.files)}
        onSelect={(path) => {
          dispatch({ type: "open_file", path });
          dispatch({ type: "set_active_file", path });
        }}
        onClose={() => setQuickOpenOpen(false)}
      />
      <div
        className="hidden h-full lg:grid"
        style={{ gridTemplateColumns: gridColumns, gridTemplateRows: `40px 1fr ${terminalHeight}px 36px` }}
      >
        <div style={{ gridColumn: gridColumnSpan, gridRow: "1" }}>
          <PlaygroundTopBar
            workspaceName={activeTemplate.title}
            workspaceFiles={workspace.files}
            activeFile={workspace.activeFile}
            onImportFiles={(files) => dispatch({ type: "import_files", files })}
            onExportZip={handleExportZip}
            onExportCurrentFile={handleExportCurrentFile}
            onOpenGithubImport={() => setImportModalOpen(true)}
            onResetWorkspace={() => setConfirmAction("reset")}
            gitBranch={terminalState.commandSuccesses.includes("git:init") ? "main" : null}
          />
        </div>

        {!leftCollapsed ? (
          <div className="overflow-hidden" style={{ gridColumn: "1", gridRow: "2 / 4" }}>
            <FileExplorer
              workspace={workspace}
              tree={tree}
              onOpenFile={(path) => dispatch({ type: "open_file", path })}
              onCreateFile={(path) => dispatch({ type: "create_file", path })}
              onRenameFile={(oldPath, newPath) => dispatch({ type: "rename_file", oldPath, newPath })}
              onDeleteFile={(path) => dispatch({ type: "delete_file", path })}
              onImportFiles={(files) => dispatch({ type: "import_files", files })}
            />
          </div>
        ) : null}

        <div className="relative" style={{ gridColumn: "2", gridRow: "2 / 3" }}>
          <EditorPane
            workspace={workspace}
            onChangeContent={(path, content) => dispatch({ type: "update_content", path, content })}
            onActivateFile={(path) => dispatch({ type: "set_active_file", path })}
            onCloseFile={(path) => dispatch({ type: "close_file", path })}
          />
        </div>

        {hasTasks && !rightCollapsed ? (
          <div style={{ gridColumn: "3", gridRow: "2 / 4" }}>
            <TaskPanel
              quest={activeQuest!}
              results={taskResults}
              revealedHintsByTask={revealedHintsByTask}
              onRevealHint={(taskId) =>
                setRevealedHintsByTask((previous) => ({
                  ...previous,
                  [taskId]: Math.min(
                    (previous[taskId] ?? 0) + 1,
                    activeQuest!.tasks.find((task) => task.id === taskId)?.hints.length ?? 0
                  ),
                }))
              }
              speedrunEnabled={speedrunState.enabled}
              speedrunLabel={`Timer: ${formatDuration(speedrunTimeMs)}${bestTimeMs ? ` (best ${formatDuration(bestTimeMs)})` : ""}`}
              onToggleSpeedrun={(enabled) => {
                setSpeedrunState((previous) => toggleSpeedrun(previous, enabled));
                emittedQuestRef.current = false;
              }}
              achievements={achievements}
              walletMode={walletMode}
              onSetWalletMode={setWalletMode}
              burnerAddress={burnerWallet?.publicKey ?? null}
              externalAddress={publicKey?.toBase58() ?? null}
              balanceLabel={balanceLabel}
              onRefreshBalance={() => void handleRefreshBalance()}
              onCreateBurner={handleCreateBurner}
              onResetBurner={handleResetBurner}
              onExportBurner={handleExportBurner}
              onConnectExternal={() => setVisible(true)}
              onDisconnectExternal={() => void disconnect()}
              externalConnected={connected}
              terminalHints={terminalState.errors.slice(-3).map((entry) => entry.hint)}
            />
          </div>
        ) : null}

        {!bottomCollapsed ? (
          <div style={{ gridColumn: terminalColumnSpan, gridRow: "3" }}>
            <TerminalPane
              entries={terminalEntries}
              commandHistory={terminalState.commandHistory}
              onRunCommand={(command) => void runCommand(command)}
              onAutocomplete={(input) => getAutocompleteSuggestions({ input, filePaths: Object.keys(workspace.files) })}
              onApplySuggestion={applySuggestion}
              inputRef={terminalInputRef}
            />
          </div>
        ) : null}

        <div style={{ gridColumn: gridColumnSpan, gridRow: "4" }}>
          <StatusBar
            leftCollapsed={leftCollapsed}
            rightCollapsed={rightCollapsed}
            bottomCollapsed={bottomCollapsed}
            saveState={saveState}
            hasTasks={hasTasks}
            onToggleLeft={() => setLeftCollapsed((previous) => !previous)}
            onToggleRight={() => setRightCollapsed((previous) => !previous)}
            onToggleBottom={() => setBottomCollapsed((previous) => !previous)}
            onResetWorkspace={() => setConfirmAction("reset")}
            onLoadTemplate={() => setConfirmAction("template")}
            onOpenTemplateGallery={() => setTemplateModalOpen(true)}
            onOpenGithubImport={() => setImportModalOpen(true)}
            onExportZip={handleExportZip}
            onShareSnapshot={() => void handleShareSnapshot()}
            onCopyShareLink={() => void handleCopyShareLink()}
          />
        </div>
      </div>

      <div className="flex h-full flex-col lg:hidden">
        <div className={hasTasks ? "h-[45%] min-h-0" : "h-[60%] min-h-0"}>
          <EditorPane
            workspace={workspace}
            onChangeContent={(path, content) => dispatch({ type: "update_content", path, content })}
            onActivateFile={(path) => dispatch({ type: "set_active_file", path })}
            onCloseFile={(path) => dispatch({ type: "close_file", path })}
          />
        </div>
        <div className={hasTasks ? "h-[28%] min-h-0 border-t border-[#2f2f2f]" : "h-[40%] min-h-0 border-t border-[#2f2f2f]"}>
          <TerminalPane
            entries={terminalEntries}
            commandHistory={terminalState.commandHistory}
            onRunCommand={(command) => void runCommand(command)}
            onAutocomplete={(input) => getAutocompleteSuggestions({ input, filePaths: Object.keys(workspace.files) })}
            onApplySuggestion={applySuggestion}
          />
        </div>
        {hasTasks && (
          <div className="h-[27%] min-h-0 border-t border-[#2f2f2f]">
            <TaskPanel
              quest={activeQuest!}
              results={taskResults}
              revealedHintsByTask={revealedHintsByTask}
              onRevealHint={(taskId) =>
                setRevealedHintsByTask((previous) => ({
                  ...previous,
                  [taskId]: Math.min(
                    (previous[taskId] ?? 0) + 1,
                    activeQuest!.tasks.find((task) => task.id === taskId)?.hints.length ?? 0
                  ),
                }))
              }
              speedrunEnabled={speedrunState.enabled}
              speedrunLabel={`Timer: ${formatDuration(speedrunTimeMs)}`}
              onToggleSpeedrun={(enabled) => setSpeedrunState((previous) => toggleSpeedrun(previous, enabled))}
              achievements={achievements}
              walletMode={walletMode}
              onSetWalletMode={setWalletMode}
              burnerAddress={burnerWallet?.publicKey ?? null}
              externalAddress={publicKey?.toBase58() ?? null}
              balanceLabel={balanceLabel}
              onRefreshBalance={() => void handleRefreshBalance()}
              onCreateBurner={handleCreateBurner}
              onResetBurner={handleResetBurner}
              onExportBurner={handleExportBurner}
              onConnectExternal={() => setVisible(true)}
              onDisconnectExternal={() => void disconnect()}
              externalConnected={connected}
              terminalHints={terminalState.errors.slice(-3).map((entry) => entry.hint)}
            />
          </div>
        )}
      </div>

      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => (!open ? setConfirmAction(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction === "reset" ? "Reset workspace" : "Load active template"}</DialogTitle>
            <DialogDescription>
              {confirmAction === "reset"
                ? "Reset the workspace and terminal state."
                : "Reload files from the active template and replace current workspace."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Gallery</DialogTitle>
            <DialogDescription>Select a template to replace your workspace files.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {playgroundTemplatesV2.map((template) => (
              <button
                type="button"
                key={template.id}
                className="block w-full rounded border border-[#323232] p-3 text-left hover:bg-[#252526]"
                onClick={() => {
                  loadTemplate(template.id);
                  setTemplateModalOpen(false);
                }}
              >
                <p className="text-sm font-semibold">{template.title}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Public GitHub Repo</DialogTitle>
            <DialogDescription>Supports owner/repo or full URL. Imports files as read-only.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={importRepo}
              onChange={(event) => setImportRepo(event.target.value)}
              placeholder="solana-labs/solana-program-library"
              aria-label="GitHub repository"
              disabled={importBusy}
            />
            <Input
              value={importBranch}
              onChange={(event) => setImportBranch(event.target.value)}
              placeholder="Branch (optional, defaults to HEAD)"
              aria-label="GitHub branch"
              disabled={importBusy}
            />
            {importProgress && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Downloading files...</span>
                  <span>
                    {importProgress.completed} / {importProgress.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${importProgress.total > 0 ? (importProgress.completed / importProgress.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                {importProgress.currentFile && (
                  <p className="truncate text-xs text-muted-foreground">{importProgress.currentFile}</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setImportModalOpen(false)} disabled={importBusy}>
              Cancel
            </Button>
            <Button type="button" onClick={() => void handleImportGithub()} disabled={importBusy || !importRepo.trim()}>
              {importBusy ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={gitTokenDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            gitTokenResolveRef.current?.(null);
            gitTokenResolveRef.current = null;
            setGitTokenDialogOpen(false);
            setGitTokenInput("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GitHub Token Required</DialogTitle>
            <DialogDescription>
              Enter a personal access token for git push or private repo access. The token is stored in session memory only.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            value={gitTokenInput}
            onChange={(e) => setGitTokenInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            aria-label="GitHub personal access token"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                gitTokenResolveRef.current?.(null);
                gitTokenResolveRef.current = null;
                setGitTokenDialogOpen(false);
                setGitTokenInput("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                gitTokenResolveRef.current?.(gitTokenInput || null);
                gitTokenResolveRef.current = null;
                setGitTokenDialogOpen(false);
                setGitTokenInput("");
              }}
              disabled={!gitTokenInput.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
