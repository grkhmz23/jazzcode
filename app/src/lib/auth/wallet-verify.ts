import nacl from "tweetnacl";
import bs58 from "bs58";
import { prisma } from "@/lib/db/client";
import { createWalletSignInMessage } from "@/lib/auth/wallet-message";

/**
 * Verify an ed25519 signature for wallet authentication
 * @param walletAddress - The Solana wallet address (base58 encoded public key)
 * @param signature - The signature (base58 encoded)
 * @param message - The message that was signed
 * @returns boolean indicating if the signature is valid
 */
export function verifyWalletSignature(
  walletAddress: string,
  signature: string,
  message: string
): boolean {
  try {
    // Decode the wallet address (public key) from base58
    const publicKey = bs58.decode(walletAddress);

    // Verify the public key is the expected length (32 bytes for ed25519)
    if (publicKey.length !== 32) {
      return false;
    }

    // Decode the signature from base58
    const signatureBytes = bs58.decode(signature);

    // Verify the signature is the expected length (64 bytes for ed25519)
    if (signatureBytes.length !== 64) {
      return false;
    }

    // Encode the message as UTF-8 bytes
    const messageBytes = new TextEncoder().encode(message);

    // Verify the signature using tweetnacl
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey
    );

    return isValid;
  } catch (error) {
    // Any error (malformed address, invalid signature, etc.) returns false
    console.error("Wallet signature verification error:", error);
    return false;
  }
}

export interface WalletAuthVerificationInput {
  address: string;
  signature: string;
  nonce: string;
}

export interface WalletAuthVerificationResult {
  ok: boolean;
  error?: string;
}

/**
 * Verify wallet auth payload:
 * - nonce exists for address
 * - nonce is not expired / used
 * - signature matches message format
 * - nonce is marked used after success
 */
export async function verifyWalletAuth(
  input: WalletAuthVerificationInput
): Promise<WalletAuthVerificationResult> {
  const { address, signature, nonce } = input;

  if (!address || !signature || !nonce) {
    return { ok: false, error: "Missing wallet auth fields" };
  }

  const nonceRecord = await prisma.walletNonce.findFirst({
    where: { address, nonce },
    orderBy: { expiresAt: "desc" },
  });

  if (!nonceRecord) {
    return { ok: false, error: "Invalid or missing nonce" };
  }

  if (nonceRecord.used) {
    return { ok: false, error: "Nonce has already been used" };
  }

  if (nonceRecord.expiresAt <= new Date()) {
    return { ok: false, error: "Nonce has expired" };
  }

  const message = createWalletSignInMessage(nonce);
  const signatureIsValid = verifyWalletSignature(address, signature, message);
  if (!signatureIsValid) {
    return { ok: false, error: "Invalid wallet signature" };
  }

  const markUsed = await prisma.walletNonce.updateMany({
    where: {
      id: nonceRecord.id,
      used: false,
      expiresAt: { gt: new Date() },
    },
    data: { used: true },
  });

  if (markUsed.count !== 1) {
    return { ok: false, error: "Nonce is no longer valid" };
  }

  return { ok: true };
}
