"use client";

import dynamic from "next/dynamic";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { get, set } from "idb-keyval";
import { Button } from "@/components/ui/button";
import { lessonMdxComponents } from "@/components/learn/mdx-components";
import {
  LearnRuntimeProvider,
  type LearnRuntimeContextValue,
} from "@/components/learn/runtime-context";
import { CourseManifest, Lesson } from "@/lib/courses/manifest";
import {
  computeObjectiveStatuses,
  ObjectiveDefinition,
} from "@/lib/objectives";
import {
  createInitialTerminalState,
  runTerminalCommand,
  TerminalSimState,
} from "@/lib/terminal-sim";
import {
  applyPatch,
  createSnapshot,
  listFiles,
  loadWorkspace,
  readFile,
  replaceWorkspace,
  WorkspaceDocument,
} from "@/lib/workspace";

import { configureMonacoLoader } from "@/lib/monaco-loader";

const MonacoEditor = dynamic(
  () => {
    configureMonacoLoader();
    return import("@monaco-editor/react");
  },
  { ssr: false }
);

type LearnProgress = {
  currentLessonId: string;
  quizResults: Record<string, boolean>;
  checkpointSeen: Record<string, boolean>;
};

function progressKey(userId: string, courseId: string): string {
  return `learn-progress:${userId}:${courseId}`;
}

function objectivesForLesson(lesson: Lesson): ObjectiveDefinition[] {
  const terminalObjectives = lesson.objectives
    .filter((objective) => objective.type === "terminal")
    .map((objective, index) => ({
      id: objective.id,
      type: "TerminalCommandExecuted" as const,
      commandPattern: new RegExp(
        `^${(lesson.terminalScript?.[index]?.command ?? "").replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}`
      ),
    }));

  const fileObjectives = lesson.objectives
    .filter((objective) => objective.type === "file")
    .map((objective) => ({
      id: objective.id,
      type: "FileContains" as const,
      path: "src/main.ts",
      pattern: /\S+/,
    }));

  const quizObjectives = lesson.objectives
    .filter((objective) => objective.type === "quiz")
    .map((objective) => ({
      id: objective.id,
      type: "QuizPassed" as const,
      quizId: lesson.id,
    }));

  return [...terminalObjectives, ...fileObjectives, ...quizObjectives];
}

function languageFromPath(path: string): string {
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".toml")) return "ini";
  return "plaintext";
}

export function LearnRunner({
  manifest,
  mdxByLesson,
}: {
  manifest: CourseManifest;
  mdxByLesson: Record<string, MDXRemoteSerializeResult>;
}) {
  const t = useTranslations("lesson");
  const tp = useTranslations("playground");
  const { data: session } = useSession();
  const userId = session?.user?.email ?? "anonymous";
  const [workspace, setWorkspace] = useState<WorkspaceDocument | null>(null);
  const [activeFile, setActiveFile] = useState<string>("src/main.ts");
  const [currentLessonId, setCurrentLessonId] = useState<string>(manifest.lessons[0]?.id ?? "");
  const [terminalState, setTerminalState] = useState<TerminalSimState>(createInitialTerminalState());
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Solana terminal simulator ready.",
  ]);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [runnerJobResults, setRunnerJobResults] = useState<Record<string, boolean>>({});
  const [confirmedSignatures, setConfirmedSignatures] = useState<string[]>([]);
  const [deployedProgramIds, setDeployedProgramIds] = useState<string[]>([]);
  const [checkpointBanner, setCheckpointBanner] = useState<string | null>(null);
  const [checkpointSeen, setCheckpointSeen] = useState<Record<string, boolean>>({});
  const [importUrl, setImportUrl] = useState<string>("");
  const [importStatus, setImportStatus] = useState<string>("");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      const doc = await loadWorkspace(userId, manifest.slug);
      if (!mounted) return;
      setWorkspace(doc);

      const progress = await get<LearnProgress>(progressKey(userId, manifest.slug));
      if (!progress) return;
      if (progress.currentLessonId) {
        setCurrentLessonId(progress.currentLessonId);
      }
      setQuizResults(progress.quizResults ?? {});
      setCheckpointSeen(progress.checkpointSeen ?? {});
    };

    void boot();
    return () => {
      mounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [manifest.slug, userId]);

  useEffect(() => {
    const persist = async () => {
      const progress: LearnProgress = {
        currentLessonId,
        quizResults,
        checkpointSeen,
      };
      await set(progressKey(userId, manifest.slug), progress);
    };

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void persist();
    }, 200);
  }, [currentLessonId, quizResults, checkpointSeen, userId, manifest.slug]);

  const lesson =
    manifest.lessons.find((item) => item.id === currentLessonId) ??
    manifest.lessons[0];

  const fileList = useMemo(() => {
    if (!workspace) return [];
    return listFiles(workspace.root).sort((a, b) => a.localeCompare(b));
  }, [workspace]);

  const filesMap = useMemo(() => {
    if (!workspace) return {};
    const map: Record<string, string> = {};
    fileList.forEach((filePath) => {
      map[filePath] = readFile(workspace.root, filePath) ?? "";
    });
    return map;
  }, [workspace, fileList]);

  const objectiveDefs = useMemo(() => objectivesForLesson(lesson), [lesson]);

  const objectiveStatuses = useMemo(
    () =>
      computeObjectiveStatuses(objectiveDefs, {
        lastCommand,
        terminalState,
        files: filesMap,
        quizResults,
        runnerJobResults,
        confirmedSignatures,
        deployedProgramIds,
      }),
    [
      objectiveDefs,
      lastCommand,
      terminalState,
      filesMap,
      quizResults,
      runnerJobResults,
      confirmedSignatures,
      deployedProgramIds,
    ]
  );

  const allObjectivesComplete =
    objectiveStatuses.length > 0 && objectiveStatuses.every((status) => status.complete);

  useEffect(() => {
    const notifyCheckpoint = async () => {
      if (!lesson.checkpointId || !allObjectivesComplete || checkpointSeen[lesson.checkpointId]) {
        return;
      }
      await createSnapshot(userId, manifest.slug, lesson.checkpointId);
      setCheckpointSeen((prev) => ({ ...prev, [lesson.checkpointId as string]: true }));
      setCheckpointBanner(`Checkpoint achieved: ${lesson.title}`);
      setTimeout(() => setCheckpointBanner(null), 2500);
    };

    void notifyCheckpoint();
  }, [allObjectivesComplete, checkpointSeen, lesson, manifest.slug, userId]);

  const updateWorkspaceFile = (path: string, content: string) => {
    if (!workspace) return;
    void applyPatch(userId, manifest.slug, [{ path, content }]).then((doc) => {
      setWorkspace(doc);
    });
  };

  const runtimeContext: LearnRuntimeContextValue = {
    getFileContent: (path) => filesMap[path] ?? "",
    updateFileContent: (path, content) => updateWorkspaceFile(path, content),
    runSnippet: (_path, code) => {
      setTerminalLines((prev) => [...prev, `snippet> executed (${code.length} chars)`]);
    },
    submitQuizResult: (quizId, passed) => {
      setQuizResults((prev) => ({ ...prev, [quizId]: passed }));
    },
    terminalState,
  };

  const nextLessonIndex = manifest.lessons.findIndex((item) => item.id === lesson.id) + 1;

  return (
    <LearnRuntimeProvider value={runtimeContext}>
      <div className="h-[calc(100vh-4rem)] bg-[#1e1e1e] text-[#d4d4d4]">
        {checkpointBanner ? (
          <div className="border-b border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            {checkpointBanner}
          </div>
        ) : null}

        <div className="grid h-full grid-cols-[220px_1fr_300px] grid-rows-[1fr_220px]">
          <aside className="border-r border-[#3c3c3c] bg-[#252526] p-3">
            <p className="mb-2 text-xs uppercase text-[#9d9d9d]">Files</p>
            <div className="mb-2 space-y-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  void replaceWorkspace(userId, manifest.slug, {
                    "src/main.ts": "console.log('hello solana');\n",
                    "Anchor.toml": "[provider]\ncluster = \"devnet\"\n",
                    "README.md": `# ${manifest.slug}\n\nStart your exercises in src/main.ts\n`,
                  }).then((doc) => {
                    setWorkspace(doc);
                    setImportStatus("Template loaded");
                  });
                }}
              >
                {t("startFromTemplate")}
              </Button>
              <input
                value={importUrl}
                onChange={(event) => setImportUrl(event.target.value)}
                className="w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1 text-xs"
                placeholder="https://github.com/owner/repo"
              />
              <Button
                type="button"
                size="sm"
                className="w-full"
                onClick={() => {
                  void fetch("/api/runner/import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ repoUrl: importUrl }),
                  })
                    .then(async (response) => {
                      const payload = (await response.json()) as {
                        files?: Record<string, string>;
                        error?: string;
                      };
                      if (!response.ok || !payload.files) {
                        throw new Error(payload.error ?? "Import failed");
                      }
                      return replaceWorkspace(userId, manifest.slug, payload.files);
                    })
                    .then((doc) => {
                      setWorkspace(doc);
                      setImportStatus("GitHub repository imported");
                    })
                    .catch((error: unknown) => {
                      setImportStatus(error instanceof Error ? error.message : "Import failed");
                    });
                }}
              >
                {t("importFromGithub")}
              </Button>
              {importStatus ? (
                <p className="text-[11px] text-[#9d9d9d]">{importStatus}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              {fileList.map((path) => (
                <button
                  key={path}
                  type="button"
                  className={`block w-full rounded px-2 py-1 text-left text-xs ${
                    activeFile === path ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
                  }`}
                  onClick={() => setActiveFile(path)}
                >
                  {path}
                </button>
              ))}
            </div>
          </aside>

          <main className="border-r border-[#3c3c3c]">
            <div className="h-full grid grid-rows-[1fr_auto]">
              <MonacoEditor
                path={activeFile}
                language={languageFromPath(activeFile)}
                theme="vs-dark"
                value={filesMap[activeFile] ?? ""}
                onChange={(value) => updateWorkspaceFile(activeFile, value ?? "")}
                options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 13 }}
              />
              <div className="max-h-[45%] overflow-auto border-t border-[#3c3c3c] bg-[#1b1b1b] p-4">
                <h2 className="mb-3 text-sm font-semibold">{lesson.title}</h2>
                <article className="prose prose-invert max-w-none text-sm">
                  <MDXRemote {...mdxByLesson[lesson.id]} components={lessonMdxComponents} />
                </article>
                <div className="mt-4 flex items-center gap-2">
                  {nextLessonIndex < manifest.lessons.length ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setCurrentLessonId(manifest.lessons[nextLessonIndex].id);
                      }}
                    >
                      {t("nextLesson")}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </main>

          <aside className="bg-[#1f1f1f] p-3">
            <p className="mb-2 text-xs uppercase text-[#9d9d9d]">Objectives</p>
            {(lesson.type === "multi-file-challenge" || lesson.type === "devnet-challenge") && (
              <div className="mb-3 space-y-2">
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    void fetch("/api/runner/job", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        courseId: manifest.slug,
                        jobType: "anchor_build",
                        files: filesMap,
                      }),
                    })
                      .then((response) => response.json())
                      .then((payload: { result?: { exitCode: number; stdout: string; stderr: string } }) => {
                        const passed = payload.result?.exitCode === 0;
                        setRunnerJobResults((prev) => ({ ...prev, anchor_build: passed }));
                        setTerminalLines((prev) => [
                          ...prev,
                          "[runner] anchor build",
                          payload.result?.stdout ?? "",
                          payload.result?.stderr ?? "",
                        ]);
                      });
                  }}
                >
                  {t("runAnchorBuild")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    void fetch("/api/runner/job", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId,
                        courseId: manifest.slug,
                        jobType: "anchor_test",
                        files: filesMap,
                      }),
                    })
                      .then((response) => response.json())
                      .then((payload: { result?: { exitCode: number; stdout: string; stderr: string; artifacts?: { txSignature?: string; programId?: string } } }) => {
                        const passed = payload.result?.exitCode === 0;
                        setRunnerJobResults((prev) => ({ ...prev, anchor_test: passed }));
                        const signature = payload.result?.artifacts?.txSignature;
                        const programId = payload.result?.artifacts?.programId;
                        if (signature) setConfirmedSignatures((prev) => [...prev, signature]);
                        if (programId) setDeployedProgramIds((prev) => [...prev, programId]);
                        setTerminalLines((prev) => [
                          ...prev,
                          "[runner] anchor test",
                          payload.result?.stdout ?? "",
                          payload.result?.stderr ?? "",
                        ]);
                      });
                  }}
                >
                  {t("runAnchorTest")}
                </Button>
              </div>
            )}
            <div className="space-y-2">
              {lesson.objectives.map((objective) => {
                const done = objectiveStatuses.find((status) => status.id === objective.id)?.complete ?? false;
                return (
                  <div key={objective.id} className={`rounded border p-2 text-xs ${done ? "border-green-500/50" : "border-[#3c3c3c]"}`}>
                    <p className={done ? "text-green-300" : "text-[#d4d4d4]"}>{objective.text}</p>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="col-span-2 border-t border-[#3c3c3c] bg-[#1a1a1a] p-2">
            <div className="mb-2 h-[145px] overflow-auto rounded border border-[#3c3c3c] bg-black/40 p-2 font-mono text-xs">
              {terminalLines.map((line, idx) => (
                <div key={`${line}-${idx}`}>{line}</div>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const command = terminalInput.trim();
                if (!command) return;
                const result = runTerminalCommand(terminalState, command);
                setTerminalState(result.state);
                setLastCommand(command);
                setTerminalLines((prev) => [
                  ...prev,
                  `$ ${command}`,
                  ...(result.stdout ? [result.stdout] : []),
                  ...(result.stderr ? [result.stderr] : []),
                ]);
                setTerminalInput("");
              }}
            >
              <input
                value={terminalInput}
                onChange={(event) => setTerminalInput(event.target.value)}
                className="w-full rounded border border-[#3c3c3c] bg-[#252526] px-2 py-1 text-xs"
                placeholder={t("runSimulatedCommands")}
              />
              <Button type="submit" size="sm">
                {tp("run")}
              </Button>
            </form>
          </div>

          <div className="border-t border-l border-[#3c3c3c] bg-[#1f1f1f] p-2 text-xs text-[#9d9d9d]">
            {t("autosaveEnabled")}
          </div>
        </div>
      </div>
    </LearnRuntimeProvider>
  );
}
