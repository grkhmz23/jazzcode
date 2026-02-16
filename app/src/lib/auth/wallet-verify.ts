import nacl from "tweetnacl";
import bs58 from "bs58";

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
