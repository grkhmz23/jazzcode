import { VFSNode } from "@/lib/devlab/types";

function cloneNode(node: VFSNode): VFSNode {
  if (node.type === "file") {
    return { ...node };
  }
  const children: Record<string, VFSNode> = {};
  Object.entries(node.children ?? {}).forEach(([k, v]) => {
    children[k] = cloneNode(v);
  });
  return { ...node, children };
}

function normalize(path: string): string[] {
  return path
    .replace(/^~\//, "")
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);
}

function traverse(root: VFSNode, path: string): { node: VFSNode | null; parent: VFSNode | null; leaf: string | null } {
  const parts = normalize(path);
  if (parts.length === 0) return { node: root, parent: null, leaf: null };

  let current: VFSNode = root;
  let parent: VFSNode | null = null;

  for (const part of parts) {
    if (current.type !== "directory") return { node: null, parent, leaf: part };
    parent = current;
    const next = current.children?.[part];
    if (!next) return { node: null, parent, leaf: part };
    current = next;
  }

  return { node: current, parent, leaf: parts[parts.length - 1] ?? null };
}

function ensureDir(root: VFSNode, parts: string[]): VFSNode {
  const out = cloneNode(root);
  let current = out;
  for (const part of parts) {
    if (current.type !== "directory") break;
    if (!current.children) current.children = {};
    if (!current.children[part]) {
      current.children[part] = { type: "directory", name: part, children: {} };
    }
    current = current.children[part];
  }
  return out;
}

function withPath(root: VFSNode, path: string, updater: (node: VFSNode | null) => VFSNode | null): VFSNode {
  const parts = normalize(path);
  if (parts.length === 0) {
    const updated = updater(root);
    return updated ?? root;
  }

  const cloned = cloneNode(root);
  let current = cloned;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (current.type !== "directory") return cloned;
    if (!current.children) current.children = {};
    if (!current.children[part]) {
      current.children[part] = { type: "directory", name: part, children: {} };
    }
    current = current.children[part];
  }

  const leaf = parts[parts.length - 1];
  if (current.type !== "directory") return cloned;
  if (!current.children) current.children = {};

  const updated = updater(current.children[leaf] ?? null);
  if (updated === null) {
    delete current.children[leaf];
  } else {
    current.children[leaf] = updated;
  }

  return cloned;
}

export function createDefaultProject(): VFSNode {
  return {
    type: "directory",
    name: "/",
    children: {
      "my-solana-project": {
        type: "directory",
        name: "my-solana-project",
        children: {
          ".gitignore": {
            type: "file",
            name: ".gitignore",
            content: "target/\nnode_modules/\n.anchor/\n",
          },
          "Anchor.toml": {
            type: "file",
            name: "Anchor.toml",
            content:
              "[features]\nseeds = false\nskip-lint = false\n\n[programs.devnet]\nmy_program = \"11111111111111111111111111111111\"\n\n[provider]\ncluster = \"devnet\"\nwallet = \"~/.config/solana/id.json\"\n\n[scripts]\ntest = \"yarn ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts\"\n",
          },
          "Cargo.toml": {
            type: "file",
            name: "Cargo.toml",
            content:
              "[workspace]\nmembers = [\n    \"programs/*\"\n]\nresolver = \"2\"\n",
          },
          "package.json": {
            type: "file",
            name: "package.json",
            content:
              '{\n  "name": "my-solana-project",\n  "private": true,\n  "scripts": {\n    "test": "anchor test"\n  },\n  "dependencies": {\n    "@coral-xyz/anchor": "^0.30.1",\n    "@solana/web3.js": "^1.95.0"\n  }\n}\n',
          },
          programs: {
            type: "directory",
            name: "programs",
            children: {
              my_program: {
                type: "directory",
                name: "my_program",
                children: {
                  "Cargo.toml": {
                    type: "file",
                    name: "Cargo.toml",
                    content:
                      "[package]\nname = \"my_program\"\nversion = \"0.1.0\"\nedition = \"2021\"\n\n[lib]\ncrate-type = [\"cdylib\", \"lib\"]\nname = \"my_program\"\n\n[dependencies]\nanchor-lang = \"0.30.1\"\n",
                  },
                  src: {
                    type: "directory",
                    name: "src",
                    children: {
                      "lib.rs": {
                        type: "file",
                        name: "lib.rs",
                        content:
                          "use anchor_lang::prelude::*;\n\ndeclare_id!(\"11111111111111111111111111111111\");\n\n#[program]\npub mod my_program {\n    use super::*;\n\n    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize {}\n",
                      },
                    },
                  },
                },
              },
            },
          },
          tests: {
            type: "directory",
            name: "tests",
            children: {
              "my_program.ts": {
                type: "file",
                name: "my_program.ts",
                content:
                  "import * as anchor from \"@coral-xyz/anchor\";\nimport { expect } from \"chai\";\n\ndescribe(\"my_program\", () => {\n  it(\"initializes\", async () => {\n    expect(true).to.equal(true);\n  });\n});\n",
              },
            },
          },
          app: {
            type: "directory",
            name: "app",
            children: {
              src: {
                type: "directory",
                name: "src",
                children: {
                  "index.ts": {
                    type: "file",
                    name: "index.ts",
                    content:
                      "import { Connection } from '@solana/web3.js';\n\nconst connection = new Connection('https://api.devnet.solana.com');\nconsole.log('Client ready', connection.rpcEndpoint);\n",
                  },
                },
              },
              "package.json": {
                type: "file",
                name: "package.json",
                content:
                  '{\n  "name": "my-solana-app",\n  "private": true,\n  "dependencies": {\n    "@solana/web3.js": "^1.95.0"\n  }\n}\n',
              },
            },
          },
        },
      },
    },
  };
}

export function getFile(root: VFSNode, path: string): string | null {
  const { node } = traverse(root, path);
  if (!node || node.type !== "file") return null;
  return node.content ?? "";
}

export function setFile(root: VFSNode, path: string, content: string): VFSNode {
  return withPath(root, path, (node) => ({
    type: "file",
    name: normalize(path).at(-1) ?? "file",
    content,
    modified: true,
    ...(node?.type === "file" ? node : {}),
  }));
}

export function listDir(root: VFSNode, path: string): string[] {
  const { node } = traverse(root, path);
  if (!node || node.type !== "directory") return [];
  return Object.keys(node.children ?? {}).sort();
}

export function deleteNode(root: VFSNode, path: string): VFSNode {
  return withPath(root, path, () => null);
}

export function createFile(root: VFSNode, path: string, content: string): VFSNode {
  return setFile(root, path, content);
}

export function createDir(root: VFSNode, path: string): VFSNode {
  const parts = normalize(path);
  return ensureDir(root, parts);
}

export function snapshot(root: VFSNode): string {
  return JSON.stringify(root);
}

export function restore(json: string): VFSNode {
  return JSON.parse(json) as VFSNode;
}
