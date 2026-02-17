import { PublicKey } from "@solana/web3.js";
import type { TokenAccountView } from "../types";

interface ParsedTokenAccountInfo {
  mint: string;
  tokenAmount: {
    amount: string;
    decimals?: number;
  };
}

interface ParsedTokenAccountData {
  parsed?: {
    info?: ParsedTokenAccountInfo;
  };
}

interface TokenAccountEntry {
  pubkey: string;
  account: {
    owner: string;
    data: ParsedTokenAccountData;
  };
}

interface TokenAccountsResponse {
  result?: {
    value?: TokenAccountEntry[];
  };
}

function assertPublicKey(value: string, field: string): string {
  try {
    return new PublicKey(value).toBase58();
  } catch {
    throw new Error(`Invalid ${field}: ${value}`);
  }
}

function formatUiAmount(amountRaw: string, decimals: number): string {
  const amount = BigInt(amountRaw);
  const base = BigInt(10) ** BigInt(decimals);
  const whole = amount / base;
  const fraction = amount % base;

  if (decimals === 0) {
    return whole.toString();
  }

  return `${whole.toString()}.${fraction.toString().padStart(decimals, "0")}`;
}

function parseEntry(entry: TokenAccountEntry): TokenAccountView {
  const ata = assertPublicKey(entry.pubkey, "token account pubkey");
  const programId = assertPublicKey(entry.account.owner, "token account owner programId");

  const info = entry.account.data.parsed?.info;
  if (!info) {
    throw new Error(`Missing parsed.info for token account ${ata}`);
  }

  const mint = assertPublicKey(info.mint, "mint pubkey");
  const amountRaw = info.tokenAmount.amount;
  if (!/^\d+$/.test(amountRaw)) {
    throw new Error(`Invalid token amount for ${ata}: ${amountRaw}`);
  }

  const decimals = info.tokenAmount.decimals;
  if (typeof decimals !== "number" || !Number.isInteger(decimals)) {
    throw new Error(`Missing decimals for ${ata}`);
  }
  if (decimals < 0 || decimals > 18) {
    throw new Error(`Invalid decimals for ${ata}: ${decimals}`);
  }

  return {
    mint,
    ata,
    amountRaw,
    decimals,
    amountUi: formatUiAmount(amountRaw, decimals),
    programId,
  };
}

export function parseSplTokenAccountsResponse(payload: unknown): TokenAccountView[] {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Token account payload must be an object");
  }

  const response = payload as TokenAccountsResponse;
  const entries = response.result?.value;
  if (!Array.isArray(entries)) {
    throw new Error("Token account payload missing result.value array");
  }

  return entries
    .map(parseEntry)
    .sort((left, right) => (left.mint === right.mint ? left.ata.localeCompare(right.ata) : left.mint.localeCompare(right.mint)));
}
