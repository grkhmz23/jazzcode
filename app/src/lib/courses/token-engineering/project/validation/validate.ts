import { PublicKey } from "@solana/web3.js";
import { DECIMALS_MAX, DECIMALS_MIN } from "../constants";
import type { TokenConfig, ValidatedTokenConfigResult } from "../types";

const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function assertPublicKey(value: string, field: string): string {
  try {
    return new PublicKey(value).toBase58();
  } catch {
    throw new Error(`Invalid ${field}: ${value}`);
  }
}

function assertU64String(value: string, field: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid ${field}: ${value}`);
  }

  const parsed = BigInt(value);
  if (parsed < BigInt(0) || parsed > U64_MAX) {
    throw new Error(`${field} out of u64 range: ${value}`);
  }
  return parsed;
}

function getRequiredStringField(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${field}`);
  }
  return value;
}

function normalizeRecipientList(value: unknown): Array<{ owner: string; amount: string }> {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error("recipients must be an array");
  }

  return value.map((item, index) => {
    if (!isObject(item)) {
      throw new Error(`recipient ${index} must be an object`);
    }
    if (typeof item.owner !== "string" || typeof item.amount !== "string") {
      throw new Error(`recipient ${index} must include owner and amount`);
    }
    return {
      owner: assertPublicKey(item.owner, `recipient ${index} owner`),
      amount: item.amount,
    };
  });
}

export function validateTokenConfig(input: unknown): ValidatedTokenConfigResult {
  if (!isObject(input)) {
    throw new Error("Token config must be an object");
  }

  const name = getRequiredStringField(input, "name");
  const symbol = getRequiredStringField(input, "symbol");
  const mintAuthorityInput = getRequiredStringField(input, "mintAuthority");
  const initialSupplyInput = getRequiredStringField(input, "initialSupply");

  const decimals = input.decimals;
  if (typeof decimals !== "number" || !Number.isInteger(decimals)) {
    throw new Error("decimals must be an integer");
  }
  if (decimals < DECIMALS_MIN || decimals > DECIMALS_MAX) {
    throw new Error(`decimals out of range: ${decimals}`);
  }

  const mintAuthority = assertPublicKey(mintAuthorityInput, "mintAuthority");

  const freezeAuthorityRaw = input.freezeAuthority;
  const freezeAuthority =
    freezeAuthorityRaw === null || freezeAuthorityRaw === undefined
      ? null
      : typeof freezeAuthorityRaw === "string"
        ? assertPublicKey(freezeAuthorityRaw, "freezeAuthority")
        : (() => {
            throw new Error("freezeAuthority must be a string or null");
          })();

  const updateAuthorityRaw = input.updateAuthority;
  const updateAuthority =
    updateAuthorityRaw === null || updateAuthorityRaw === undefined
      ? null
      : typeof updateAuthorityRaw === "string"
        ? assertPublicKey(updateAuthorityRaw, "updateAuthority")
        : (() => {
            throw new Error("updateAuthority must be a string or null");
          })();

  const initialSupply = assertU64String(initialSupplyInput, "initialSupply");
  const recipients = normalizeRecipientList(input.recipients);
  let recipientsTotal = BigInt(0);
  for (let index = 0; index < recipients.length; index += 1) {
    recipientsTotal += assertU64String(recipients[index].amount, `recipient ${index} amount`);
  }
  if (recipientsTotal > initialSupply) {
    throw new Error("recipients total exceeds initialSupply");
  }

  const extensions = isObject(input.extensions) ? input.extensions : {};

  const metadataPointer = extensions.metadataPointer;
  if (metadataPointer !== undefined) {
    if (!isObject(metadataPointer)) {
      throw new Error("metadataPointer must be an object");
    }
    if (typeof metadataPointer.authority !== "string" || typeof metadataPointer.metadataAddress !== "string") {
      throw new Error("metadataPointer requires authority and metadataAddress");
    }
    assertPublicKey(metadataPointer.authority, "metadataPointer.authority");
    assertPublicKey(metadataPointer.metadataAddress, "metadataPointer.metadataAddress");
  }

  const transferFee = extensions.transferFee;
  if (transferFee !== undefined) {
    if (!isObject(transferFee)) {
      throw new Error("transferFee must be an object");
    }
    if (typeof transferFee.authority !== "string") {
      throw new Error("transferFee.authority is required");
    }
    assertPublicKey(transferFee.authority, "transferFee.authority");
    const feeBps = transferFee.feeBps;
    if (typeof feeBps !== "number" || !Number.isInteger(feeBps) || feeBps < 0 || feeBps > 10_000) {
      throw new Error(`transferFee.feeBps out of range: ${String(feeBps)}`);
    }
    if (typeof transferFee.maxFee !== "string") {
      throw new Error("transferFee.maxFee must be a string");
    }
    assertU64String(transferFee.maxFee, "transferFee.maxFee");
  }

  const defaultAccountState = extensions.defaultAccountState;
  if (defaultAccountState !== undefined) {
    if (!isObject(defaultAccountState)) {
      throw new Error("defaultAccountState must be an object");
    }
    if (defaultAccountState.state !== "initialized" && defaultAccountState.state !== "frozen") {
      throw new Error(`Invalid defaultAccountState.state: ${String(defaultAccountState.state)}`);
    }
  }

  const permanentDelegate = extensions.permanentDelegate;
  if (permanentDelegate !== undefined) {
    if (!isObject(permanentDelegate) || typeof permanentDelegate.delegate !== "string") {
      throw new Error("permanentDelegate.delegate is required");
    }
    assertPublicKey(permanentDelegate.delegate, "permanentDelegate.delegate");
  }

  const normalizedConfig: TokenConfig = {
    name,
    symbol,
    decimals,
    mintAuthority,
    freezeAuthority,
    updateAuthority,
    initialSupply: initialSupply.toString(),
    extensions: {
      metadataPointer:
        metadataPointer && isObject(metadataPointer)
          ? {
              authority: assertPublicKey(String(metadataPointer.authority), "metadataPointer.authority"),
              metadataAddress: assertPublicKey(
                String(metadataPointer.metadataAddress),
                "metadataPointer.metadataAddress",
              ),
            }
          : undefined,
      transferFee:
        transferFee && isObject(transferFee)
          ? {
              authority: assertPublicKey(String(transferFee.authority), "transferFee.authority"),
              feeBps: Number(transferFee.feeBps),
              maxFee: assertU64String(String(transferFee.maxFee), "transferFee.maxFee").toString(),
            }
          : undefined,
      defaultAccountState:
        defaultAccountState && isObject(defaultAccountState)
          ? { state: defaultAccountState.state as "initialized" | "frozen" }
          : undefined,
      permanentDelegate:
        permanentDelegate && isObject(permanentDelegate)
          ? {
              delegate: assertPublicKey(
                String(permanentDelegate.delegate),
                "permanentDelegate.delegate",
              ),
            }
          : undefined,
    },
    recipients,
  };

  return {
    config: normalizedConfig,
    recipientsTotal: recipientsTotal.toString(),
    remaining: (initialSupply - recipientsTotal).toString(),
    invariants: [
      "decimals within supported range",
      "recipients total does not exceed initial supply",
      "extension authorities validated",
      "all amount fields are u64-safe strings",
    ],
  };
}
