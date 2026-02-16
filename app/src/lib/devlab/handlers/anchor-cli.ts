import { generateAddress } from "@/lib/devlab/chain-state";
import { resolvePath, toVfsPath } from "@/lib/devlab/path-utils";
import { ChainState, CommandResult, VFSNode } from "@/lib/devlab/types";
import { getFile } from "@/lib/devlab/vfs";

type AnchorParams = {
  args: string[];
  chainState: ChainState;
  vfs: VFSNode;
};

function ok(stdout: string, sideEffects: CommandResult["sideEffects"] = []): CommandResult {
  return { stdout, stderr: "", exitCode: 0, sideEffects };
}

function fail(stderr: string): CommandResult {
  return { stdout: "", stderr, exitCode: 1 };
}

export function handleAnchorCli({ args, chainState, vfs }: AnchorParams): CommandResult {
  const sub = args[0] ?? "";

  if (sub === "--version" || sub === "version") {
    return ok("anchor-cli 0.30.1");
  }

  if (sub === "init") {
    const name = args[1] ?? "my_program";
    return ok(`Initializing ${name}\nCreated project`, [
      {
        type: "create_file",
        path: `my-solana-project/programs/${name}/src/lib.rs`,
        content:
          "use anchor_lang::prelude::*;\n\ndeclare_id!(\"11111111111111111111111111111111\");\n\n#[program]\npub mod my_program {\n    use super::*;\n    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize {}\n",
      },
      {
        type: "create_file",
        path: "my-solana-project/Anchor.toml",
        content:
          "[provider]\ncluster = \"devnet\"\nwallet = \"~/.config/solana/id.json\"\n\n[programs.devnet]\nmy_program = \"11111111111111111111111111111111\"\n",
      },
    ]);
  }

  if (sub === "build") {
    const lib = getFile(vfs, "my-solana-project/programs/my_program/src/lib.rs") ?? "";
    if (!lib.includes("#[program]") || lib.includes("unresolved_import") || lib.includes("syntax_error")) {
      return fail("error[E0432]: unresolved import `anchor_lang::preludee`\n --> programs/my_program/src/lib.rs:1:5");
    }
    return ok(
      "Finished release [optimized] target(s) in 2.47s\nGenerating IDL: target/idl/my_program.json\nBuild success",
      [
        {
          type: "create_file",
          path: "my-solana-project/target/deploy/my_program.so",
          content: "<compiled-binary>",
        },
        {
          type: "create_file",
          path: "my-solana-project/target/idl/my_program.json",
          content: '{"version":"0.1.0","name":"my_program","instructions":[]}',
        },
      ]
    );
  }

  if (sub === "test") {
    const testFile = getFile(vfs, "my-solana-project/tests/my_program.ts") ?? "";
    if (!testFile) return fail("error: tests/my_program.ts not found");
    if (!/assert|expect/.test(testFile)) {
      return fail("AssertionError: expected false to equal true");
    }
    return ok(
      "Running test suite...\nStarting anchor localnet...\nmy_program\n  ✔ initializes (122ms)\n\n1 passing (124ms)"
    );
  }

  if (sub === "deploy") {
    const so = getFile(vfs, "my-solana-project/target/deploy/my_program.so");
    if (!chainState.lastBuildSucceeded || so === null) {
      return fail("Error: anchor build must succeed before deploy");
    }
    const defaultWallet = chainState.defaultWallet;
    const balance = defaultWallet ? chainState.wallets[defaultWallet]?.balance ?? 0 : 0;
    if (balance < 2) {
      return fail("Error: Account has insufficient funds for spend");
    }
    const programId = generateAddress(Date.now() + balance * 1000);
    return ok(`Deploying cluster: ${chainState.config.rpcUrl}\nProgram Id: ${programId}\nDeploy success`, [
      { type: "deploy_program", programId },
    ]);
  }

  if (sub === "idl" && args[1] === "init") {
    const programId = args[2];
    const filepath = args.includes("--filepath") ? args[args.indexOf("--filepath") + 1] : "";
    if (!programId || !filepath) return fail("Usage: anchor idl init <program_id> --filepath <idl_path>");
    const resolved = toVfsPath(resolvePath(chainState.currentDir, filepath));
    const idl = getFile(vfs, resolved);
    if (idl === null) return fail(`IDL file not found at ${filepath}`);
    return ok(`IDL account created for ${programId}`);
  }

  if (sub === "verify") {
    const programId = args[1];
    if (!programId) return fail("Usage: anchor verify <program_id>");
    if (!chainState.programs[programId]) return fail(`Program ${programId} not found`);
    return ok(`Verifiable build matched for ${programId}`);
  }

  return fail(`anchor: unknown command '${args.join(" ")}'`);
}
