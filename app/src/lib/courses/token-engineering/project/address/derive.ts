import { createHash } from "crypto";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function sha256Bytes(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

function encodeBase58(bytes: Uint8Array): string {
  let value = BigInt(0);
  for (const byte of bytes) {
    value = (value << BigInt(8)) + BigInt(byte);
  }

  let encoded = "";
  while (value > BigInt(0)) {
    const mod = Number(value % BigInt(58));
    encoded = BASE58_ALPHABET[mod] + encoded;
    value /= BigInt(58);
  }

  for (const byte of bytes) {
    if (byte === 0) {
      encoded = `1${encoded}`;
    } else {
      break;
    }
  }

  return encoded || "1";
}

function toPseudoAddress(seed: string): string {
  const bytes = sha256Bytes(seed);
  const base58 = encodeBase58(bytes);
  if (base58.length >= 44) {
    return base58.slice(0, 44);
  }
  return `${base58}${"1".repeat(44 - base58.length)}`;
}

export function deriveMintAddress(symbol: string, mintAuthority: string): string {
  return toPseudoAddress(`mint:${symbol}:${mintAuthority}`);
}

export function deriveAtaAddress(mint: string, owner: string): string {
  return toPseudoAddress(`ata:${mint}:${owner}`);
}

export function deriveRecipientAtas(mint: string, owners: readonly string[]): Array<{ owner: string; ata: string }> {
  return owners.map((owner) => ({
    owner,
    ata: deriveAtaAddress(mint, owner),
  }));
}
