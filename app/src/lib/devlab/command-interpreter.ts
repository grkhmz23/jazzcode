import {
  deployProgram,
  recordTransaction,
  setBuildStatus,
  setConfig,
  setCurrentDir,
} from "@/lib/devlab/chain-state";
import { parseCommand } from "@/lib/devlab/command-parser";
import { applySolanaStateEffect, handleSolanaCli } from "@/lib/devlab/handlers/solana-cli";
import { handleAnchorCli } from "@/lib/devlab/handlers/anchor-cli";
import { handleSplTokenCli } from "@/lib/devlab/handlers/spl-token-cli";
import { handleGeneralCli } from "@/lib/devlab/handlers/general-cli";
import { ChainState, CommandResult, SideEffect, VFSNode } from "@/lib/devlab/types";
import { createFile, deleteNode, setFile } from "@/lib/devlab/vfs";

export type InterpreterInput = {
  command: string;
  chainState: ChainState;
  vfs: VFSNode;
};

export type InterpreterOutput = {
  result: CommandResult;
  chainState: ChainState;
  vfs: VFSNode;
};

function cloneState(state: ChainState): ChainState {
  return {
    ...state,
    config: { ...state.config },
    wallets: { ...state.wallets },
    tokens: { ...state.tokens },
    tokenAccounts: { ...state.tokenAccounts },
    programs: { ...state.programs },
    transactions: [...state.transactions],
  };
}

function applyEffect(chainState: ChainState, vfs: VFSNode, effect: SideEffect): { chainState: ChainState; vfs: VFSNode } {
  let nextState = chainState;
  let nextVfs = vfs;

  switch (effect.type) {
    case "create_file":
      nextVfs = createFile(nextVfs, effect.path, effect.content);
      break;
    case "update_file":
      nextVfs = setFile(nextVfs, effect.path, effect.content);
      break;
    case "delete_file":
      nextVfs = deleteNode(nextVfs, effect.path);
      break;
    case "set_config": {
      const configKey = effect.key as keyof ChainState["config"];
      nextState = setConfig(nextState, configKey, effect.value);
      break;
    }
    case "record_tx":
      nextState = recordTransaction(nextState, effect.signature, effect.description);
      break;
    case "deploy_program":
      nextState = deployProgram(nextState, effect.programId);
      break;
    default:
      nextState = applySolanaStateEffect(nextState, effect);
      break;
  }

  return { chainState: nextState, vfs: nextVfs };
}

export function interpretCommand({ command, chainState, vfs }: InterpreterInput): InterpreterOutput {
  const trimmed = command.trim();
  if (!trimmed) {
    return {
      result: { stdout: "", stderr: "", exitCode: 0, sideEffects: [] },
      chainState,
      vfs,
    };
  }

  const parsed = parseCommand(trimmed);
  const bin = parsed[0] ?? "";
  const args = parsed.slice(1);
  const chainDraft = cloneState(chainState);

  let result: CommandResult;

  if (bin === "solana" || bin === "solana-keygen") {
    result = handleSolanaCli({ command: bin, args, chainState: chainDraft, vfs });
  } else if (bin === "anchor") {
    result = handleAnchorCli({ args, chainState: chainDraft, vfs });
  } else if (bin === "spl-token") {
    result = handleSplTokenCli({ args, chainState: chainDraft });
  } else {
    result = handleGeneralCli({ command: bin, args, chainState: chainDraft, vfs });
  }

  let nextState = chainDraft;
  let nextVfs = vfs;

  for (const effect of result.sideEffects ?? []) {
    const applied = applyEffect(nextState, nextVfs, effect);
    nextState = applied.chainState;
    nextVfs = applied.vfs;
  }

  if (result.nextDir) {
    nextState = setCurrentDir(nextState, result.nextDir);
  }

  if (bin === "anchor" && args[0] === "build") {
    nextState = setBuildStatus(nextState, result.exitCode === 0);
  }

  return { result, chainState: nextState, vfs: nextVfs };
}
