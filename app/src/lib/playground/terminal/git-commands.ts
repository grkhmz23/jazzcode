import type { ParsedCommand, CommandExecutionResult, GitAuthState, TerminalIo, TerminalState, TerminalOutputLine } from "@/lib/playground/terminal/commands";
import { createTerminalError } from "@/lib/playground/terminal/errors";
import { GitObjectStore } from "@/lib/playground/fs/git-object-store";
import { createGitFsAdapter } from "@/lib/playground/fs/git-fs-adapter";

function outputError(errorText: string, hintText: string): TerminalOutputLine[] {
  return [
    { kind: "error", text: `Error: ${errorText}` },
    { kind: "system", text: `Hint: ${hintText}` },
  ];
}

function appendError(state: TerminalState, code: Parameters<typeof createTerminalError>[0], message?: string): TerminalState {
  const error = createTerminalError(code, message);
  return {
    ...state,
    errors: [...state.errors, error].slice(-30),
  };
}

async function loadGit(): Promise<typeof import("isomorphic-git")> {
  return import("isomorphic-git");
}

function extractMessageFlag(argv: string[]): string | null {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-m" && i + 1 < argv.length) {
      return argv[i + 1];
    }
    if (argv[i].startsWith("-m") && argv[i].length > 2) {
      return argv[i].slice(2);
    }
  }
  return null;
}

function createWorkspaceAccess(io: TerminalIo, deleteFile?: (path: string) => void) {
  return {
    readFile: (path: string) => io.readFile(path),
    writeFile: (path: string, content: string) => io.createOrUpdateFile(path, content),
    deleteFile: (path: string) => deleteFile?.(path),
    listPaths: () => io.listPaths(),
    fileExists: (path: string) => io.fileExists(path),
  };
}

export async function handleGitCommand(
  parsed: ParsedCommand,
  state: TerminalState,
  io: TerminalIo,
  gitAuth: GitAuthState,
  onRequestToken: () => Promise<string | null>
): Promise<CommandExecutionResult> {
  const sub = parsed.positional[0];

  if (!sub) {
    const error = createTerminalError("MISSING_ARGUMENT", "Usage: git <subcommand>");
    return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
  }

  const gitStore = new GitObjectStore();

  try {
    await gitStore.init();
  } catch {
    return {
      nextState: state,
      lines: [{ kind: "error", text: "Error: Could not initialize git storage." }],
    };
  }

  const workspaceAccess = createWorkspaceAccess(io, io.deleteFile);
  const fs = createGitFsAdapter(gitStore, workspaceAccess);

  let git: Awaited<ReturnType<typeof loadGit>>;
  try {
    git = await loadGit();
  } catch {
    return {
      nextState: state,
      lines: [{ kind: "error", text: "Error: Could not load git module." }],
    };
  }

  const dir = "/";

  if (sub === "init") {
    try {
      await git.init({ fs, dir });
      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "git:init"],
        },
        lines: [
          { kind: "output", text: "Initialized empty Git repository in /" },
        ],
        metadata: { commandSucceeded: "git init" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git init failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "status") {
    try {
      const matrix = await git.statusMatrix({ fs, dir });
      const lines: TerminalOutputLine[] = [];

      const staged: string[] = [];
      const modified: string[] = [];
      const untracked: string[] = [];

      for (const [filepath, head, workdir, index] of matrix) {
        if (head === 0 && workdir === 2 && index === 0) {
          untracked.push(filepath);
        } else if (head === 0 && workdir === 2 && index === 2) {
          staged.push(filepath);
        } else if (head === 1 && workdir === 2 && index === 2) {
          staged.push(filepath);
        } else if (head === 1 && workdir === 2 && index === 1) {
          modified.push(filepath);
        } else if (head === 1 && workdir === 0 && index === 0) {
          staged.push(`deleted: ${filepath}`);
        } else if (index !== head || workdir !== index) {
          modified.push(filepath);
        }
      }

      if (staged.length > 0) {
        lines.push({ kind: "system", text: "Changes to be committed:" });
        for (const f of staged) lines.push({ kind: "output", text: `  ${f}` });
      }
      if (modified.length > 0) {
        lines.push({ kind: "system", text: "Changes not staged for commit:" });
        for (const f of modified) lines.push({ kind: "output", text: `  modified: ${f}` });
      }
      if (untracked.length > 0) {
        lines.push({ kind: "system", text: "Untracked files:" });
        for (const f of untracked) lines.push({ kind: "output", text: `  ${f}` });
      }
      if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
        lines.push({ kind: "output", text: "nothing to commit, working tree clean" });
      }

      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "git:status"],
        },
        lines,
        metadata: { commandSucceeded: "git status" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git status failed";
      if (msg.includes("Could not find")) {
        const error = createTerminalError("GIT_NOT_INITIALIZED" as Parameters<typeof createTerminalError>[0]);
        return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
      }
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "add") {
    const target = parsed.positional[1];
    if (!target) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: git add <file|.>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      if (target === ".") {
        const matrix = await git.statusMatrix({ fs, dir });
        for (const [filepath, , workdir] of matrix) {
          if (workdir === 0) {
            await git.remove({ fs, dir, filepath });
          } else {
            await git.add({ fs, dir, filepath });
          }
        }
      } else {
        await git.add({ fs, dir, filepath: target });
      }
      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "git:add"],
        },
        lines: [{ kind: "output", text: target === "." ? "Added all files to staging area." : `Added ${target} to staging area.` }],
        metadata: { commandSucceeded: "git add" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git add failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "commit") {
    const message = extractMessageFlag(parsed.argv);
    if (!message) {
      const error = createTerminalError("MISSING_ARGUMENT", 'Usage: git commit -m "message"');
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      const sha = await git.commit({
        fs,
        dir,
        message,
        author: { name: "Playground User", email: "user@playground.local" },
      });
      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "git:commit"],
        },
        lines: [
          { kind: "output", text: `[main ${sha.slice(0, 7)}] ${message}` },
        ],
        metadata: { commandSucceeded: "git commit" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git commit failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "log") {
    try {
      const oneline = parsed.argv.includes("--oneline");
      const commits = await git.log({ fs, dir, depth: 20 });
      const lines: TerminalOutputLine[] = commits.map((entry) => {
        if (oneline) {
          return { kind: "output" as const, text: `${entry.oid.slice(0, 7)} ${entry.commit.message.split("\n")[0]}` };
        }
        return {
          kind: "output" as const,
          text: `commit ${entry.oid}\nAuthor: ${entry.commit.author.name} <${entry.commit.author.email}>\n\n    ${entry.commit.message}\n`,
        };
      });

      if (lines.length === 0) {
        lines.push({ kind: "output", text: "No commits yet." });
      }

      return {
        nextState: {
          ...state,
          commandSuccesses: [...state.commandSuccesses, "git:log"],
        },
        lines,
        metadata: { commandSucceeded: "git log" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git log failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "branch") {
    const branchName = parsed.positional[1];
    try {
      if (!branchName) {
        const branches = await git.listBranches({ fs, dir });
        const current = await git.currentBranch({ fs, dir });
        const lines = branches.map((b) => ({
          kind: "output" as const,
          text: b === current ? `* ${b}` : `  ${b}`,
        }));
        return {
          nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:branch"] },
          lines,
          metadata: { commandSucceeded: "git branch" },
        };
      }
      await git.branch({ fs, dir, ref: branchName });
      return {
        nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:branch"] },
        lines: [{ kind: "output", text: `Created branch ${branchName}` }],
        metadata: { commandSucceeded: "git branch" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git branch failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "checkout") {
    const createNew = parsed.argv.includes("-b");
    const branchName = parsed.positional[1];
    if (!branchName) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: git checkout [-b] <branch>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      if (createNew) {
        await git.branch({ fs, dir, ref: branchName });
      }
      await git.checkout({ fs, dir, ref: branchName });
      return {
        nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:checkout"] },
        lines: [{ kind: "output", text: `Switched to branch '${branchName}'` }],
        metadata: { commandSucceeded: "git checkout" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git checkout failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "remote") {
    const action = parsed.positional[1];
    if (action === "add") {
      const name = parsed.positional[2];
      const url = parsed.positional[3];
      if (!name || !url) {
        const error = createTerminalError("MISSING_ARGUMENT", "Usage: git remote add <name> <url>");
        return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
      }
      try {
        await git.addRemote({ fs, dir, remote: name, url });
        return {
          nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:remote:add"] },
          lines: [{ kind: "output", text: `Added remote ${name} -> ${url}` }],
          metadata: { commandSucceeded: "git remote add" },
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "git remote add failed";
        return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
      }
    }

    return {
      nextState: state,
      lines: [{ kind: "error", text: "Usage: git remote add <name> <url>" }],
    };
  }

  if (sub === "clone") {
    const url = parsed.positional[1];
    if (!url) {
      const error = createTerminalError("MISSING_ARGUMENT", "Usage: git clone <url>");
      return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
    }

    try {
      const http = await import("isomorphic-git/http/web");
      const lines: TerminalOutputLine[] = [
        { kind: "output", text: `Cloning ${url}...` },
      ];

      const onAuth = gitAuth.token
        ? () => ({ username: gitAuth.token! })
        : undefined;

      await git.clone({
        fs,
        http: http.default ?? http,
        dir,
        url,
        singleBranch: true,
        depth: 1,
        onAuth,
      });

      lines.push({ kind: "output", text: "Clone complete." });
      return {
        nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:clone"] },
        lines,
        metadata: { commandSucceeded: "git clone" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git clone failed";
      if (msg.includes("401") || msg.includes("403")) {
        return {
          nextState: appendError(state, "GIT_AUTH_REQUIRED" as Parameters<typeof createTerminalError>[0], msg),
          lines: [
            { kind: "error", text: `Error: Authentication required - ${msg}` },
            { kind: "system", text: "Hint: For private repos, provide a GitHub token via git push." },
          ],
        };
      }
      if (msg.includes("404")) {
        return {
          nextState: state,
          lines: [{ kind: "error", text: `Error: Repository not found - ${url}` }],
        };
      }
      return {
        nextState: appendError(state, "GIT_CLONE_FAILED" as Parameters<typeof createTerminalError>[0], msg),
        lines: [{ kind: "error", text: `Error: ${msg}` }],
      };
    }
  }

  if (sub === "pull") {
    try {
      const http = await import("isomorphic-git/http/web");
      const onAuth = gitAuth.token
        ? () => ({ username: gitAuth.token! })
        : undefined;

      await git.pull({
        fs,
        http: http.default ?? http,
        dir,
        singleBranch: true,
        author: { name: "Playground User", email: "user@playground.local" },
        onAuth,
      });

      return {
        nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:pull"] },
        lines: [{ kind: "output", text: "Pull complete." }],
        metadata: { commandSucceeded: "git pull" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git pull failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  if (sub === "push") {
    let token = gitAuth.token;
    if (!token) {
      token = await onRequestToken();
      if (!token) {
        const error = createTerminalError("GIT_AUTH_REQUIRED" as Parameters<typeof createTerminalError>[0]);
        return {
          nextState: appendError(state, error.code, error.message),
          lines: outputError(error.message, error.hint),
        };
      }
      gitAuth.token = token;
    }

    try {
      const http = await import("isomorphic-git/http/web");
      await git.push({
        fs,
        http: http.default ?? http,
        dir,
        onAuth: () => ({ username: token! }),
      });

      return {
        nextState: { ...state, commandSuccesses: [...state.commandSuccesses, "git:push"] },
        lines: [{ kind: "output", text: "Push complete." }],
        metadata: { commandSucceeded: "git push" },
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "git push failed";
      return { nextState: state, lines: [{ kind: "error", text: `Error: ${msg}` }] };
    }
  }

  const error = createTerminalError("UNKNOWN_COMMAND", `Unknown git subcommand: ${sub}`);
  return { nextState: appendError(state, error.code, error.message), lines: outputError(error.message, error.hint) };
}
