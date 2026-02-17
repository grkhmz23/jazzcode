"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import { EditorPane } from "@/components/playground/EditorPane";
import { FileExplorer } from "@/components/playground/FileExplorer";
import { StatusBar } from "@/components/playground/StatusBar";
import { TaskPanel } from "@/components/playground/TaskPanel";
import { TerminalPane } from "@/components/playground/TerminalPane";
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
  downloadWorkspaceZip,
  evaluateAchievements,
  evaluateQuest,
  executeTerminalCommand,
  formatDuration,
  getAutocompleteSuggestions,
  getSpeedrunTimeMs,
  getTemplateByIdV2,
  importGitHubRepository,
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
  solanaFundamentalsQuest,
  solanaFundamentalsTemplate,
  stopSpeedrun,
  toggleSpeedrun,
  updateFileContent,
  workspaceReducer,
} from "@/lib/playground";
import { TaskResult } from "@/lib/playground/tasks/types";
import { Workspace } from "@/lib/playground/types";

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
    solanaFundamentalsTemplate,
    createWorkspaceFromTemplate
  );
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

  const emittedQuestRef = useRef(false);
  const checkpointRef = useRef<string[]>([]);
  const workspaceRef = useRef(workspace);
  const terminalRef = useRef(terminalState);

  const { connection } = useConnection();
  const { publicKey, connected, disconnect, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  useEffect(() => {
    terminalRef.current = terminalState;
  }, [terminalState]);

  const activeTemplate = useMemo(() => {
    const byWorkspace = getTemplateByIdV2(workspace.templateId);
    return byWorkspace ?? solanaFundamentalsTemplate;
  }, [workspace.templateId]);

  const tree = useMemo(() => listTree(workspace), [workspace]);

  const checkpoints = useMemo(() => {
    const completeTaskIds = new Set<string>();
    const contextResults = evaluateQuest(solanaFundamentalsQuest, {
      workspace,
      terminalState,
      checkpoints: [],
    });
    contextResults.forEach((result) => {
      if (result.complete) {
        completeTaskIds.add(result.taskId);
      }
    });

    return solanaFundamentalsQuest.tasks
      .filter((task) => task.checkpointId && completeTaskIds.has(task.id))
      .map((task) => task.checkpointId as string);
  }, [workspace, terminalState]);

  const taskResults: TaskResult[] = useMemo(
    () =>
      evaluateQuest(solanaFundamentalsQuest, {
        workspace,
        terminalState,
        checkpoints,
      }),
    [workspace, terminalState, checkpoints]
  );

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

        if (snapshot) {
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
          }
        }

        const burner = await loadBurnerWalletFromIndexedDb();
        if (mounted && burner) {
          setBurnerWallet({
            publicKey: burner.publicKey,
            secretKey: burner.secretKey,
          });
        }

        const progress = await loadQuestProgressFromIndexedDb(solanaFundamentalsQuest.id);
        if (mounted && progress) {
          setPersistedAchievements(progress.achievements);
          setBestTimeMs(progress.speedrunBestMs);
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
        questId: solanaFundamentalsQuest.id,
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
      questId: solanaFundamentalsQuest.id,
      speedrunBestMs: nextBest,
      achievements: achievements.map((entry) => entry.id),
      completions: 1,
      updatedAt: Date.now(),
    });
  }, [taskResults, speedrunState, workspaceRef, achievements, onQuestComplete, bestTimeMs]);

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
    dispatch({ type: "load_template", template: solanaFundamentalsTemplate });
    setTerminalState(createInitialTerminalState());
    setTerminalEntries(DEFAULT_TERMINAL_ENTRIES);
    setRevealedHintsByTask({});
    emittedQuestRef.current = false;
    setRealRpcUsed(false);
    void clearWorkspaceInIndexedDb();
  };

  const handleImportGithub = async () => {
    setImportBusy(true);
    try {
      const template = await importGitHubRepository(importRepo, importBranch || undefined);
      dispatch({ type: "load_template", template });
      setImportModalOpen(false);
      setImportRepo("");
      setImportBranch("");
      toast.success("GitHub repository imported as read-only workspace");
    } catch (error) {
      const message = error instanceof Error ? error.message : "GitHub import failed";
      toast.error(message);
    } finally {
      setImportBusy(false);
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

  const gridColumns = `${leftCollapsed ? 0 : 260}px 1fr ${rightCollapsed ? 0 : 340}px`;
  const terminalHeight = bottomCollapsed ? 0 : 220;

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[680px] w-full rounded-lg border border-[#2f2f2f] bg-[#1e1e1e] text-[#d4d4d4]">
      <div
        className="hidden h-full lg:grid"
        style={{ gridTemplateColumns: gridColumns, gridTemplateRows: `1fr ${terminalHeight}px 36px` }}
      >
        {!leftCollapsed ? (
          <div className="overflow-hidden" style={{ gridColumn: "1", gridRow: "1 / 3" }}>
            <FileExplorer
              workspace={workspace}
              tree={tree}
              onOpenFile={(path) => dispatch({ type: "open_file", path })}
              onCreateFile={(path) => dispatch({ type: "create_file", path })}
              onRenameFile={(oldPath, newPath) => dispatch({ type: "rename_file", oldPath, newPath })}
              onDeleteFile={(path) => dispatch({ type: "delete_file", path })}
            />
          </div>
        ) : null}

        <div className="relative" style={{ gridColumn: "2", gridRow: "1 / 2" }}>
          <EditorPane
            workspace={workspace}
            onChangeContent={(path, content) => dispatch({ type: "update_content", path, content })}
            onActivateFile={(path) => dispatch({ type: "set_active_file", path })}
            onCloseFile={(path) => dispatch({ type: "close_file", path })}
          />
        </div>

        {!rightCollapsed ? (
          <div style={{ gridColumn: "3", gridRow: "1 / 3" }}>
            <TaskPanel
              quest={solanaFundamentalsQuest}
              results={taskResults}
              revealedHintsByTask={revealedHintsByTask}
              onRevealHint={(taskId) =>
                setRevealedHintsByTask((previous) => ({
                  ...previous,
                  [taskId]: Math.min(
                    (previous[taskId] ?? 0) + 1,
                    solanaFundamentalsQuest.tasks.find((task) => task.id === taskId)?.hints.length ?? 0
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
          <div style={{ gridColumn: "1 / 3", gridRow: "2" }}>
            <TerminalPane
              entries={terminalEntries}
              commandHistory={terminalState.commandHistory}
              onRunCommand={(command) => void runCommand(command)}
              onAutocomplete={(input) => getAutocompleteSuggestions({ input, filePaths: Object.keys(workspace.files) })}
              onApplySuggestion={applySuggestion}
            />
          </div>
        ) : null}

        <div style={{ gridColumn: "1 / 4", gridRow: "3" }}>
          <StatusBar
            leftCollapsed={leftCollapsed}
            rightCollapsed={rightCollapsed}
            bottomCollapsed={bottomCollapsed}
            saveState={saveState}
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
        <div className="h-[45%] min-h-0">
          <EditorPane
            workspace={workspace}
            onChangeContent={(path, content) => dispatch({ type: "update_content", path, content })}
            onActivateFile={(path) => dispatch({ type: "set_active_file", path })}
            onCloseFile={(path) => dispatch({ type: "close_file", path })}
          />
        </div>
        <div className="h-[28%] min-h-0 border-t border-[#2f2f2f]">
          <TerminalPane
            entries={terminalEntries}
            commandHistory={terminalState.commandHistory}
            onRunCommand={(command) => void runCommand(command)}
            onAutocomplete={(input) => getAutocompleteSuggestions({ input, filePaths: Object.keys(workspace.files) })}
            onApplySuggestion={applySuggestion}
          />
        </div>
        <div className="h-[27%] min-h-0 border-t border-[#2f2f2f]">
          <TaskPanel
            quest={solanaFundamentalsQuest}
            results={taskResults}
            revealedHintsByTask={revealedHintsByTask}
            onRevealHint={(taskId) =>
              setRevealedHintsByTask((previous) => ({
                ...previous,
                [taskId]: Math.min(
                  (previous[taskId] ?? 0) + 1,
                  solanaFundamentalsQuest.tasks.find((task) => task.id === taskId)?.hints.length ?? 0
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
            />
            <Input
              value={importBranch}
              onChange={(event) => setImportBranch(event.target.value)}
              placeholder="Branch (optional, defaults to HEAD)"
              aria-label="GitHub branch"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setImportModalOpen(false)}>
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
