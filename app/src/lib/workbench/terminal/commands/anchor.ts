/**
 * Anchor framework simulation commands for the Workbench terminal
 */

import type {
  CommandDefinition,
  CommandExecutionResult,
  ParsedCommand,
  SimulationState,
} from "@/lib/workbench/types";
import type { DirectoryNode } from "@/lib/workbench/fs";
import {
  createDirectoryNode,
  createFileNode,
  findNode,
  insertNode,
  normalizeFSPath,
  resolvePath,
} from "@/lib/workbench/fs";
import { createTerminalError } from "../errors";

function successState(
  state: SimulationState,
  lines: string[],
  command: string
): CommandExecutionResult {
  return {
    nextState: {
      ...state,
      commandSuccesses: [...state.commandSuccesses, command],
    },
    lines: lines.map((text) => ({ kind: "output" as const, text })),
    metadata: { commandSucceeded: command },
  };
}

function errorResult(
  state: SimulationState,
  code: keyof typeof import("../errors").TERMINAL_ERRORS,
  customMessage?: string
): CommandExecutionResult {
  const error = createTerminalError(code, customMessage);
  return {
    nextState: {
      ...state,
      errors: [...state.errors, error].slice(-30),
    },
    lines: [
      { kind: "error", text: `Error: ${error.message}` },
      { kind: "system", text: `Hint: ${error.hint}` },
    ],
  };
}

// ============================================================================
// Anchor Project Templates
// ============================================================================

function generateAnchorProjectFiles(projectName: string): Array<{ path: string; content: string }> {
  const programId = "Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h";
  const safeName = projectName.replace(/-/g, "_");

  return [
    {
      path: `${projectName}/Anchor.toml`,
      content: `[features]
seeds = false
skip-lint = false

[programs.localnet]
${safeName} = "${programId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`,
    },
    {
      path: `${projectName}/Cargo.toml`,
      content: `[workspace]
members = [
    "programs/*"
]
resolver = "2"
`,
    },
    {
      path: `${projectName}/package.json`,
      content: `{
  "name": "${projectName}",
  "version": "0.1.0",
  "description": "Created with Anchor",
  "main": "index.js",
  "scripts": {
    "test": "anchor test"
  },
  "keywords": ["solana", "anchor"],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "typescript": "^4.3.5"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.29.0"
  }
}
`,
    },
    {
      path: `${projectName}/tsconfig.json`,
      content: `{
  "compilerOptions": {
    "types": ["mocha", "chai"],
    "typeRoots": ["./node_modules/@types"],
    "lib": ["es2015"],
    "module": "commonjs",
    "target": "es6",
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
`,
    },
    {
      path: `${projectName}/programs/${safeName}/Cargo.toml`,
      content: `[package]
name = "${safeName}"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${safeName}"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
`,
    },
    {
      path: `${projectName}/programs/${safeName}/src/lib.rs`,
      content: `use anchor_lang::prelude::*;

declare_id!("${programId}");

#[program]
pub mod ${safeName} {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
`,
    },
    {
      path: `${projectName}/tests/${safeName}.ts`,
      content: `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ${safeName.charAt(0).toUpperCase() + safeName.slice(1)} } from "../target/types/${safeName}";

describe("${safeName}", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.${safeName.charAt(0).toUpperCase() + safeName.slice(1)} as Program<${safeName.charAt(0).toUpperCase() + safeName.slice(1)}>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
`,
    },
    {
      path: `${projectName}/.gitignore`,
      content: `.anchor
.DS_Store
target
**/*.rs.bk
node_modules
test-ledger
`,
    },
  ];
}

// ============================================================================
// Command Handlers
// ============================================================================

function handleAnchorInit(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const projectName = parsed.positional[1];
  if (!projectName) {
    return errorResult(state, "MISSING_ARGUMENT", "Usage: anchor init <project_name>");
  }

  const resolvedPath = resolvePath(state.currentDir, projectName);
  const normalizedPath = normalizeFSPath(resolvedPath);

  // Check if directory already exists
  if (findNode(fs, normalizedPath)) {
    return errorResult(state, "PROJECT_EXISTS", `Directory '${projectName}' already exists`);
  }

  // Create project files
  const files = generateAnchorProjectFiles(projectName);

  for (const file of files) {
    const filePath = resolvePath(state.currentDir, file.path);
    const normalizedFilePath = normalizeFSPath(filePath);

    // Create parent directories
    const parts = normalizedFilePath.split("/").filter(Boolean);
    parts.pop(); // Remove filename

    let currentNode: DirectoryNode = fs;
    let currentPath = "";

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const normalizedCurrent = normalizeFSPath(`/${currentPath}`);

      let child = currentNode.children.find(
        (n): n is DirectoryNode => n.type === "directory" && n.name === part
      );

      if (!child) {
        child = createDirectoryNode(normalizedCurrent);
        currentNode.children.push(child);
        currentNode.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
      }

      currentNode = child;
    }

    // Insert file
    const fileNode = createFileNode(normalizedFilePath, file.content);
    insertNode(fs, fileNode);
  }

  return successState(
    state,
    [
      `Initialized anchor project: ${projectName}`,
      "",
      "Next steps:",
      `  cd ${projectName}`,
      "  anchor build",
      "  anchor test",
    ],
    "anchor init"
  );
}

function handleAnchorBuild(
  _parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  // Check for Anchor.toml
  const currentDir = findNode(fs, state.currentDir);
  if (!currentDir || currentDir.type !== "directory") {
    return errorResult(state, "DIRECTORY_NOT_FOUND");
  }

  const hasAnchorToml = currentDir.children.some(
    (child) => child.type === "file" && child.name === "Anchor.toml"
  );

  // Also check parent directory (in case we're in a subdirectory)
  let parentDir: DirectoryNode | null = null;
  const parentPath = state.currentDir.split("/").slice(0, -1).join("/") || "/";
  const parentNode = findNode(fs, parentPath);
  if (parentNode && parentNode.type === "directory") {
    parentDir = parentNode;
  }

  const hasAnchorTomlInParent = parentDir?.children.some(
    (child) => child.type === "file" && child.name === "Anchor.toml"
  );

  if (!hasAnchorToml && !hasAnchorTomlInParent) {
    return errorResult(
      state,
      "ANCHOR_BUILD_FAILED",
      "No Anchor.toml found. Are you in an Anchor project directory?"
    );
  }

  // Check for lib.rs with basic Anchor structure
  const programsDir = currentDir.children.find(
    (child) => child.type === "directory" && child.name === "programs"
  );

  let hasValidProgram = false;
  if (programsDir && programsDir.type === "directory") {
    for (const programDir of programsDir.children) {
      if (programDir.type !== "directory") continue;
      const srcDir = programDir.children.find(
        (child) => child.type === "directory" && child.name === "src"
      );
      if (srcDir && srcDir.type === "directory") {
        const libRs = srcDir.children.find(
          (child) => child.type === "file" && child.name === "lib.rs"
        );
        if (libRs && libRs.type === "file") {
          if (libRs.content.includes("#[program]") && libRs.content.includes("declare_id!")) {
            hasValidProgram = true;
            break;
          }
        }
      }
    }
  }

  if (!hasValidProgram && parentDir) {
    // Check in parent directory too
    const parentProgramsDir = parentDir.children.find(
      (child) => child.type === "directory" && child.name === "programs"
    );
    if (parentProgramsDir && parentProgramsDir.type === "directory") {
      for (const programDir of parentProgramsDir.children) {
        if (programDir.type !== "directory") continue;
        const srcDir = programDir.children.find(
          (child) => child.type === "directory" && child.name === "src"
        );
        if (srcDir && srcDir.type === "directory") {
          const libRs = srcDir.children.find(
            (child) => child.type === "file" && child.name === "lib.rs"
          );
          if (libRs && libRs.type === "file") {
            if (libRs.content.includes("#[program]") && libRs.content.includes("declare_id!")) {
              hasValidProgram = true;
              break;
            }
          }
        }
      }
    }
  }

  if (!hasValidProgram) {
    return errorResult(
      state,
      "ANCHOR_BUILD_FAILED",
      "No valid Anchor program found. Ensure programs/<name>/src/lib.rs contains #[program] and declare_id!"
    );
  }

  return successState(
    state,
    [
      "Building program...",
      "   Compiling proc-macro2 v1.0.78",
      "   Compiling quote v1.0.35",
      "   Compiling unicode-ident v1.0.12",
      "   Compiling syn v2.0.48",
      "   Compiling serde v1.0.196",
      "   Compiling serde_json v1.0.111",
      "   Compiling anchor-lang v0.29.0",
      "   Compiling anchor-project v0.1.0",
      "    Finished release [optimized] target(s) in 2.34s",
      "",
      "Build successful",
    ],
    "anchor build"
  );
}

function handleAnchorTest(_parsed: ParsedCommand, state: SimulationState): CommandExecutionResult {
  return successState(
    state,
    [
      "Running tests...",
      "",
      "  anchor-project",
      "    ✓ initializes correctly (42ms)",
      "",
      "  1 passing (124ms)",
      "",
      "Tests completed successfully",
    ],
    "anchor test"
  );
}

function handleAnchorDeploy(_parsed: ParsedCommand, state: SimulationState): CommandExecutionResult {
  const programId = "Fg6PaFpoGXkYsidMpWxTWqkQskj4bJ9S3xW2hSoLhJ1h";

  return successState(
    state,
    [
      "Deploying...",
      "Program path: /workspace/target/deploy/anchor_project.so...",
      `Program Id: ${programId}`,
      "",
      "Signature:",
      "3WE5c8PBCFuvqpzE6fJPYjWXfF8p2xKZ7S3B4T5U6V7W8X9Y0Z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
      "",
      "Deploy success",
    ],
    "anchor deploy"
  );
}

// ============================================================================
// Command Router
// ============================================================================

export function handleAnchorCommand(
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
): CommandExecutionResult {
  const subcommand = parsed.positional[0];

  switch (subcommand) {
    case "init":
      return handleAnchorInit(parsed, state, fs);
    case "build":
      return handleAnchorBuild(parsed, state, fs);
    case "test":
      return handleAnchorTest(parsed, state);
    case "deploy":
      return handleAnchorDeploy(parsed, state);
    default:
      return errorResult(state, "UNKNOWN_COMMAND", `Unknown anchor subcommand: ${subcommand ?? "(none)"}`);
  }
}

export const ANCHOR_COMMAND_DEFINITIONS: Omit<CommandDefinition, "handler">[] = [
  {
    name: "anchor init",
    description: "Initialize a new Anchor project",
    usage: "anchor init <project_name>",
    flags: [],
  },
  {
    name: "anchor build",
    description: "Build the Anchor project",
    usage: "anchor build",
    flags: [],
  },
  {
    name: "anchor test",
    description: "Run Anchor tests",
    usage: "anchor test",
    flags: [],
  },
  {
    name: "anchor deploy",
    description: "Deploy the Anchor program",
    usage: "anchor deploy",
    flags: [],
  },
];
