import { resolvePath, toVfsPath } from "@/lib/devlab/path-utils";
import { ChainState, CommandResult, VFSNode } from "@/lib/devlab/types";
import { getFile, listDir } from "@/lib/devlab/vfs";

type GeneralParams = {
  command: string;
  args: string[];
  chainState: ChainState;
  vfs: VFSNode;
};

function ok(
  stdout: string,
  extra: Partial<CommandResult> = {},
  sideEffects: CommandResult["sideEffects"] = []
): CommandResult {
  return { stdout, stderr: "", exitCode: 0, sideEffects, ...extra };
}

function fail(stderr: string): CommandResult {
  return { stdout: "", stderr, exitCode: 1 };
}

function pathType(vfs: VFSNode, path: string): "file" | "directory" | null {
  const file = getFile(vfs, toVfsPath(path));
  if (file !== null) return "file";
  const dirEntries = listDir(vfs, toVfsPath(path));
  if (dirEntries.length > 0 || path === "/" || path === "/my-solana-project") return "directory";
  return null;
}

export function handleGeneralCli({ command, args, chainState, vfs }: GeneralParams): CommandResult {
  if (command === "pwd") {
    return ok(chainState.currentDir);
  }

  if (command === "ls") {
    const path = resolvePath(chainState.currentDir, args[0] ?? ".");
    const out = listDir(vfs, toVfsPath(path));
    if (out.length === 0 && pathType(vfs, path) !== "directory") {
      return fail(`ls: cannot access '${args[0] ?? "."}': No such file or directory`);
    }
    return ok(out.join("  "));
  }

  if (command === "cd") {
    const target = resolvePath(chainState.currentDir, args[0] ?? "~");
    if (pathType(vfs, target) !== "directory") {
      return fail(`cd: no such file or directory: ${args[0] ?? "~"}`);
    }
    return ok("", { nextDir: target });
  }

  if (command === "cat") {
    const target = resolvePath(chainState.currentDir, args[0] ?? "");
    const file = getFile(vfs, toVfsPath(target));
    if (file === null) return fail(`cat: ${args[0] ?? ""}: No such file`);
    return ok(file);
  }

  if (command === "echo") {
    return ok(args.join(" "));
  }

  if (command === "mkdir") {
    if (!args[0]) return fail("mkdir: missing operand");
    const path = toVfsPath(resolvePath(chainState.currentDir, args[0]));
    return ok("", {}, [{ type: "create_file", path: `${path}/.keep`, content: "" }]);
  }

  if (command === "touch") {
    if (!args[0]) return fail("touch: missing file operand");
    const path = toVfsPath(resolvePath(chainState.currentDir, args[0]));
    return ok("", {}, [{ type: "create_file", path, content: getFile(vfs, path) ?? "" }]);
  }

  if (command === "rm") {
    if (!args[0]) return fail("rm: missing operand");
    const path = toVfsPath(resolvePath(chainState.currentDir, args[0]));
    return ok("", {}, [{ type: "delete_file", path }]);
  }

  if (command === "clear") {
    return ok("", { clear: true });
  }

  if (command === "git") {
    const sub = args[0] ?? "";
    if (sub === "status") {
      return ok("On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean");
    }
    if (sub === "log") {
      return ok("commit 2f3a4bc\nAuthor: DevLab <devlab@solana.local>\nDate:   Tue Jan 16 10:30:00 2026\n\n    Initial scaffold");
    }
    return fail(`git: '${sub}' is not a git command`);
  }

  if (command === "cargo" && args[0] === "--version") {
    return ok("cargo 1.84.1 (simulated)");
  }

  if (command === "rustc" && args[0] === "--version") {
    return ok("rustc 1.84.1 (simulated)");
  }

  if (command === "node" && args[0] === "--version") {
    return ok("v20.18.0");
  }

  return fail(`${command}: command not found`);
}
