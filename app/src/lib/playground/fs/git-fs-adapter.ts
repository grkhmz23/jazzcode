import { GitObjectStore } from "@/lib/playground/fs/git-object-store";

interface WorkspaceFileAccess {
  readFile: (path: string) => string | null;
  writeFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  listPaths: () => string[];
  fileExists: (path: string) => boolean;
}

class Stat {
  type: "file" | "dir";
  size: number;
  constructor(type: "file" | "dir", size: number) {
    this.type = type;
    this.size = size;
  }
  isFile() {
    return this.type === "file";
  }
  isDirectory() {
    return this.type === "dir";
  }
  isSymbolicLink() {
    return false;
  }
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function createGitFsAdapter(
  gitStore: GitObjectStore,
  workspace: WorkspaceFileAccess
) {
  function isGitPath(filepath: string): boolean {
    const clean = filepath.replace(/^\/+/, "");
    return clean === ".git" || clean.startsWith(".git/");
  }

  function cleanPath(filepath: string): string {
    return filepath.replace(/^\/+/, "");
  }

  const fs = {
    promises: {
      async readFile(
        filepath: string,
        opts?: { encoding?: string } | string
      ): Promise<Uint8Array | string> {
        const clean = cleanPath(filepath);

        if (isGitPath(filepath)) {
          const data = await gitStore.readFile(clean);
          if (!data) {
            throw Object.assign(new Error(`ENOENT: ${filepath}`), { code: "ENOENT" });
          }
          const encoding = typeof opts === "string" ? opts : opts?.encoding;
          if (encoding === "utf8") return decoder.decode(data);
          return data;
        }

        const content = workspace.readFile(clean);
        if (content === null) {
          throw Object.assign(new Error(`ENOENT: ${filepath}`), { code: "ENOENT" });
        }
        const encoding = typeof opts === "string" ? opts : opts?.encoding;
        if (encoding === "utf8") return content;
        return encoder.encode(content);
      },

      async writeFile(
        filepath: string,
        data: Uint8Array | string,
      ): Promise<void> {
        const clean = cleanPath(filepath);

        if (isGitPath(filepath)) {
          const bytes =
            typeof data === "string" ? encoder.encode(data) : data;
          await gitStore.writeFile(clean, bytes);
          return;
        }

        const content = typeof data === "string" ? data : decoder.decode(data);
        workspace.writeFile(clean, content);
      },

      async unlink(filepath: string): Promise<void> {
        const clean = cleanPath(filepath);

        if (isGitPath(filepath)) {
          await gitStore.deleteFile(clean);
          return;
        }

        workspace.deleteFile(clean);
      },

      async readdir(filepath: string): Promise<string[]> {
        const clean = cleanPath(filepath);
        const entries = new Set<string>();

        // Collect workspace entries
        const prefix = clean ? `${clean}/` : "";
        for (const path of workspace.listPaths()) {
          if (path.startsWith(prefix)) {
            const remainder = path.slice(prefix.length);
            const segment = remainder.split("/")[0];
            if (segment) entries.add(segment);
          }
        }

        // Collect git entries
        const gitPrefix = clean ? `${clean}/` : "";
        const gitFiles = await gitStore.listFiles(gitPrefix);
        for (const gf of gitFiles) {
          const remainder = gf.slice(gitPrefix.length);
          const segment = remainder.split("/")[0];
          if (segment) entries.add(segment);
        }

        // At root level, check if .git exists
        if (!clean) {
          const gitFiles2 = await gitStore.listFiles(".git/");
          if (gitFiles2.length > 0) entries.add(".git");
        }

        return Array.from(entries).sort();
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async mkdir(filepath: string): Promise<void> {
        // No-op for virtual FS — directories are implicit
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async rmdir(filepath: string): Promise<void> {
        // No-op for virtual FS
      },

      async stat(filepath: string): Promise<Stat> {
        const clean = cleanPath(filepath);

        if (isGitPath(filepath)) {
          const data = await gitStore.readFile(clean);
          if (data) return new Stat("file", data.byteLength);

          // Check if it's a directory
          const children = await gitStore.listFiles(`${clean}/`);
          if (children.length > 0) return new Stat("dir", 0);

          throw Object.assign(new Error(`ENOENT: ${filepath}`), { code: "ENOENT" });
        }

        if (workspace.fileExists(clean)) {
          const content = workspace.readFile(clean);
          return new Stat("file", content ? encoder.encode(content).length : 0);
        }

        // Check if it's a directory
        const prefix = clean ? `${clean}/` : "";
        const hasChildren = workspace.listPaths().some((p) => p.startsWith(prefix));
        if (hasChildren || !clean) return new Stat("dir", 0);

        throw Object.assign(new Error(`ENOENT: ${filepath}`), { code: "ENOENT" });
      },

      async lstat(filepath: string): Promise<Stat> {
        return fs.promises.stat(filepath);
      },
    },
  };

  return fs;
}
