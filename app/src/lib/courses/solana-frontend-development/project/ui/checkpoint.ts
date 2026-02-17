import type { DashboardCheckpoint } from "../types";
import { parseSplTokenAccountsResponse } from "../parsers/spl-token-accounts";
import { buildSolTransferPlan } from "../tx-builders/sol-transfer";
import { buildSplTransferPlan } from "../tx-builders/spl-transfer";

export function buildTokenDashboardCheckpoint(input: {
  owner: string;
  recentBlockhash: string;
  tokenAccountsPayload: unknown;
  solTransfer: {
    to: string;
    amountSol: number;
  };
  splTransfer: {
    destinationAta: string;
    amountRaw: string;
    decimals: number;
  };
}): DashboardCheckpoint {
  const tokenAccounts = parseSplTokenAccountsResponse(input.tokenAccountsPayload);
  if (tokenAccounts.length === 0) {
    throw new Error("No token accounts available for checkpoint");
  }

  const selected = tokenAccounts[0];
  const solTransferPlan = buildSolTransferPlan({
    from: input.owner,
    to: input.solTransfer.to,
    amountSol: input.solTransfer.amountSol,
    recentBlockhash: input.recentBlockhash,
    feePayer: input.owner,
  });

  const splTransferPlan = buildSplTransferPlan({
    sourceAta: selected.ata,
    destinationAta: input.splTransfer.destinationAta,
    owner: input.owner,
    mint: selected.mint,
    amountRaw: input.splTransfer.amountRaw,
    decimals: input.splTransfer.decimals,
    expectedDecimals: selected.decimals,
    recentBlockhash: input.recentBlockhash,
    feePayer: input.owner,
  });

  return {
    owner: input.owner,
    tokenAccounts,
    solTransferPlan,
    splTransferPlan,
  };
}

export function buildTokenDashboardCheckpointJson(input: {
  owner: string;
  recentBlockhash: string;
  tokenAccountsPayload: unknown;
  solTransfer: {
    to: string;
    amountSol: number;
  };
  splTransfer: {
    destinationAta: string;
    amountRaw: string;
    decimals: number;
  };
}): string {
  const checkpoint = buildTokenDashboardCheckpoint(input);
  return JSON.stringify({
    owner: checkpoint.owner,
    tokenAccounts: checkpoint.tokenAccounts,
    solTransferPlan: checkpoint.solTransferPlan,
    splTransferPlan: checkpoint.splTransferPlan,
  });
}
