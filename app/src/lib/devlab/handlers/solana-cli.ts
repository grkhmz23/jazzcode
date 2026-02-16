import {
  generateAddress,
  generateSignature,
  updateWalletBalance,
  upsertWallet,
} from "@/lib/devlab/chain-state";
import { resolvePath, toVfsPath } from "@/lib/devlab/path-utils";
import { CommandResult, ChainState, SideEffect, VFSNode } from "@/lib/devlab/types";
import { getFile } from "@/lib/devlab/vfs";

type SolanaHandlerParams = {
  command: "solana" | "solana-keygen";
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

function currentWallet(state: ChainState): { pubkey: string; balance: number; keypairPath?: string } | null {
  if (!state.defaultWallet) return null;
  return state.wallets[state.defaultWallet] ?? null;
}

function mapRpc(value: string): { rpc: string; ws: string } | null {
  if (value === "devnet") return { rpc: "https://api.devnet.solana.com", ws: "wss://api.devnet.solana.com/" };
  if (value === "testnet") return { rpc: "https://api.testnet.solana.com", ws: "wss://api.testnet.solana.com/" };
  if (value === "mainnet-beta") {
    return { rpc: "https://api.mainnet-beta.solana.com", ws: "wss://api.mainnet-beta.solana.com/" };
  }
  if (value === "localhost") return { rpc: "http://127.0.0.1:8899", ws: "ws://127.0.0.1:8900/" };
  if (/^https?:\/\//.test(value)) {
    const ws = value.replace("https://", "wss://").replace("http://", "ws://");
    return { rpc: value, ws };
  }
  return null;
}

export function handleSolanaCli({ command, args, chainState, vfs }: SolanaHandlerParams): CommandResult {
  if (command === "solana-keygen") {
    const sub = args[0] ?? "";
    if (sub === "new") {
      const outfileArg = args.findIndex((x) => x === "--outfile");
      const outfile = outfileArg >= 0 ? args[outfileArg + 1] : "~/.config/solana/id.json";
      const path = resolvePath(chainState.currentDir, outfile);
      const seed = Date.now() + args.join(" ").length;
      const pubkey = generateAddress(seed);
      return ok(`Generating a new keypair\nWrote new keypair to ${outfile}\n===========================================================================\npubkey: ${pubkey}\n===========================================================================`, [
        { type: "create_keypair", pubkey, path: toVfsPath(path) },
        { type: "create_file", path: toVfsPath(path), content: `[${pubkey}]` },
      ]);
    }

    if (sub === "pubkey") {
      const wallet = currentWallet(chainState);
      if (!wallet) return fail("Error: No default signer found");
      return ok(wallet.pubkey);
    }

    return fail("solana-keygen: unknown command");
  }

  const sub = args[0] ?? "";

  if (sub === "--version" || sub === "version") {
    return ok("solana-cli 1.18.26 (src:simulated)");
  }

  if (sub === "config" && args[1] === "set" && args[2] === "--url") {
    const endpoint = args[3];
    if (!endpoint) return fail("error: The following required arguments were not provided: --url <URL_OR_MONIKER>");
    const mapped = mapRpc(endpoint);
    if (!mapped) return fail(`error: invalid value '${endpoint}' for '--url <URL_OR_MONIKER>'`);
    return ok(
      `Config File: ~/.config/solana/cli/config.yml\nRPC URL: ${mapped.rpc}\nWebSocket URL: ${mapped.ws}\nKeypair Path: ${chainState.config.keypairPath}\nCommitment: ${chainState.config.commitment}`,
      [
        { type: "set_config", key: "rpcUrl", value: mapped.rpc },
        { type: "set_config", key: "websocketUrl", value: mapped.ws },
      ]
    );
  }

  if (sub === "config" && args[1] === "get") {
    return ok(
      `Config File: ~/.config/solana/cli/config.yml\nRPC URL: ${chainState.config.rpcUrl}\nWebSocket URL: ${chainState.config.websocketUrl}\nKeypair Path: ${chainState.config.keypairPath}\nCommitment: ${chainState.config.commitment}`
    );
  }

  if (sub === "address") {
    const wallet = currentWallet(chainState);
    if (!wallet) return fail("No default signer found, run `solana-keygen new` to create one");
    return ok(wallet.pubkey);
  }

  if (sub === "airdrop") {
    const amount = Number(args[1]);
    if (Number.isNaN(amount) || amount <= 0) return fail("Error: Invalid airdrop amount");
    if (amount > 5) {
      return fail("Error: airdrop request failed. This can happen when the rate limit is reached.");
    }
    const wallet = args[2] ?? currentWallet(chainState)?.pubkey;
    if (!wallet) return fail("No default signer found, run `solana-keygen new` to create one");
    const signature = generateSignature(Date.now() + Math.floor(amount * 1000));
    const existing = chainState.wallets[wallet]?.balance ?? 0;
    return ok(`Signature: ${signature}\n${(existing + amount).toFixed(9)} SOL`, [
      { type: "update_balance", address: wallet, amount },
      { type: "record_tx", signature, description: `Airdrop ${amount} SOL to ${wallet}` },
    ]);
  }

  if (sub === "balance") {
    const wallet = args[1] ?? currentWallet(chainState)?.pubkey;
    if (!wallet) return fail("No default signer found");
    const balance = chainState.wallets[wallet]?.balance ?? 0;
    return ok(`${Number(balance.toFixed(9))} SOL`);
  }

  if (sub === "transfer") {
    const recipient = args[1];
    const amount = Number(args[2]);
    if (!recipient || Number.isNaN(amount) || amount <= 0) {
      return fail("Error: transfer requires recipient and amount");
    }
    const fee = 0.000005;
    const sender = currentWallet(chainState);
    if (!sender) return fail("No default signer found");
    if (sender.balance < amount + fee) {
      return fail("Error: Dynamic program error: InsufficientFunds");
    }
    const signature = generateSignature(Date.now() + recipient.length);
    return ok(`Signature: ${signature}`,
      [
        { type: "update_balance", address: sender.pubkey, amount: -(amount + fee) },
        { type: "update_balance", address: recipient, amount },
        { type: "record_tx", signature, description: `Transfer ${amount} SOL to ${recipient}` },
      ]);
  }

  if (sub === "logs") {
    const now = new Date().toISOString();
    return ok([
      `${now} Program 11111111111111111111111111111111 invoke [1]`,
      `${now} Program log: Instruction: Initialize`,
      `${now} Program 11111111111111111111111111111111 consumed 3529 of 200000 compute units`,
      `${now} Program 11111111111111111111111111111111 success`,
    ].join("\n"));
  }

  if (sub === "program" && args[1] === "deploy") {
    const target = args[2];
    if (!target) return fail("Error: deploy requires a path");
    const resolved = toVfsPath(resolvePath(chainState.currentDir, target));
    const exists = getFile(vfs, resolved);
    if (exists === null) return fail(`Error: file not found: ${target}`);
    const programId = generateAddress(Date.now() + target.length);
    return ok(`Program Id: ${programId}\nDeploy success`, [{ type: "deploy_program", programId }]);
  }

  if (sub === "program" && args[1] === "show") {
    const programId = args[2];
    if (!programId) return fail("Error: missing program id");
    const program = chainState.programs[programId];
    if (!program) return fail(`Error: Program ${programId} not found`);
    return ok(`Program Id: ${program.programId}\nOwner: BPFLoaderUpgradeab1e11111111111111111111111\nAuthority: ${program.authority}`);
  }

  if (sub === "confirm") {
    const signature = args[1];
    if (!signature) return fail("Error: missing signature");
    const tx = chainState.transactions.find((item) => item.signature === signature);
    if (!tx) return fail(`Unable to find transaction ${signature}`);
    return ok(`${signature}\nStatus: Confirmed`);
  }

  return fail(`solana: unknown command '${args.join(" ")}'`);
}

export function applySolanaStateEffect(chainState: ChainState, effect: SideEffect): ChainState {
  switch (effect.type) {
    case "update_balance": {
      return updateWalletBalance(chainState, effect.address, effect.amount);
    }
    case "create_keypair": {
      return upsertWallet(chainState, { pubkey: effect.pubkey, keypairPath: effect.path, balance: 0 });
    }
    default:
      return chainState;
  }
}
