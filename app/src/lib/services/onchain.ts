import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

// These are exported for testing purposes
export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
export const connection = new Connection(SOLANA_RPC, "confirmed");

// The XP mint address from the Superteam Academy on-chain program
// This will be set via env var once the program is deployed
export const XP_MINT = process.env.NEXT_PUBLIC_XP_MINT_ADDRESS || null;

export interface OnChainXP {
  balance: number;
  mintAddress: string;
  tokenAccount: string | null;
}

/**
 * Validates a Solana wallet address format (base58, 32-44 chars)
 */
export function isValidWalletAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  // Base58 characters: 1-9, A-H, J-N, P-Z, a-k, m-z
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58Regex.test(address)) return false;
  // Length check: Solana pubkeys are 32 bytes = 43-44 base58 chars
  if (address.length < 32 || address.length > 44) return false;
  return true;
}

/**
 * Fetches on-chain XP token balance for a wallet address.
 * Returns null if XP_MINT is not set (program not deployed).
 * Returns balance 0 if the token account doesn't exist.
 */
export async function getOnChainXP(
  walletAddress: string
): Promise<OnChainXP | null> {
  if (!XP_MINT) {
    // Program not deployed yet — return null gracefully
    return null;
  }

  try {
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(XP_MINT);

    // Find the Associated Token Account for this wallet + XP mint
    const ata = await getAssociatedTokenAddress(mint, wallet);

    try {
      const account = await getAccount(connection, ata);
      return {
        balance: Number(account.amount),
        mintAddress: XP_MINT,
        tokenAccount: ata.toBase58(),
      };
    } catch {
      // Token account doesn't exist — user has no XP tokens yet
      return {
        balance: 0,
        mintAddress: XP_MINT,
        tokenAccount: null,
      };
    }
  } catch (error) {
    console.error("Failed to fetch on-chain XP:", error);
    return null;
  }
}

// ============================================================================
// On-Chain Credentials (cNFTs via Helius DAS API)
// ============================================================================

export interface OnChainCredential {
  id: string; // asset ID
  name: string;
  description: string;
  imageUrl: string;
  trackName: string; // e.g. "Solana Fundamentals"
  level: string; // e.g. "Beginner"
  mintAddress: string;
  metadataUri: string;
  owner: string;
  collection: string | null;
  compressed: boolean;
}

// Helius DAS API response types
interface HeliusAssetAttribute {
  trait_type: string;
  value: string;
}

interface HeliusAsset {
  id: string;
  content: {
    metadata: {
      name: string;
      description: string;
      attributes?: HeliusAssetAttribute[];
    };
    links?: {
      image?: string;
    };
    files?: Array<{ uri: string }>;
    json_uri?: string;
  };
  grouping?: Array<{
    group_key: string;
    group_value: string;
  }>;
  compression?: {
    compressed: boolean;
  };
}

interface HeliusResponse {
  result?: {
    items: HeliusAsset[];
  };
}

/**
 * Fetches cNFT credentials from Helius DAS API for a wallet address.
 * Returns empty array if HELIUS_API_KEY is not set.
 * Filters for Superteam Academy credentials by collection or metadata pattern.
 */
export async function getCredentials(
  walletAddress: string
): Promise<OnChainCredential[]> {
  const heliusApiKey = process.env.HELIUS_API_KEY;

  if (!heliusApiKey) {
    // No Helius key — return empty gracefully
    return [];
  }

  if (!isValidWalletAddress(walletAddress)) {
    console.error("Invalid wallet address format:", walletAddress);
    return [];
  }

  try {
    // Use Helius DAS API: getAssetsByOwner
    const response = await fetch(
      `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "credentials",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: walletAddress,
            page: 1,
            limit: 50,
            displayOptions: {
              showCollectionMetadata: true,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Helius API error:", response.status, response.statusText);
      return [];
    }

    const data = (await response.json()) as HeliusResponse;

    if (!data.result?.items) {
      return [];
    }

    // Filter for Superteam Academy credentials
    // The collection address will be set via env var once deployed
    const collectionAddress =
      process.env.NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS || null;

    const credentials: OnChainCredential[] = data.result.items
      .filter((asset: HeliusAsset) => {
        // If collection address is set, filter by it
        if (collectionAddress) {
          return asset.grouping?.some(
            (g) => g.group_key === "collection" && g.group_value === collectionAddress
          );
        }
        // If no collection address, check for known metadata pattern
        // Look for assets with "Superteam" in the name or description
        const name = asset.content?.metadata?.name || "";
        const description = asset.content?.metadata?.description || "";
        return (
          name.includes("Superteam") ||
          description.includes("Superteam Academy")
        );
      })
      .map((asset: HeliusAsset) => ({
        id: asset.id,
        name: asset.content?.metadata?.name || "Unknown Credential",
        description: asset.content?.metadata?.description || "",
        imageUrl:
          asset.content?.links?.image ||
          asset.content?.files?.[0]?.uri ||
          "",
        trackName:
          asset.content?.metadata?.attributes?.find(
            (a) => a.trait_type === "track"
          )?.value || "",
        level:
          asset.content?.metadata?.attributes?.find(
            (a) => a.trait_type === "level"
          )?.value || "",
        mintAddress: asset.id,
        metadataUri: asset.content?.json_uri || "",
        owner: walletAddress,
        collection:
          asset.grouping?.find((g) => g.group_key === "collection")
            ?.group_value || null,
        compressed: asset.compression?.compressed || false,
      }));

    return credentials;
  } catch (error) {
    console.error("Failed to fetch credentials:", error);
    return [];
  }
}

// ============================================================================
// On-Chain Leaderboard
// ============================================================================

export interface OnChainLeaderboardEntry {
  walletAddress: string;
  xpBalance: number;
}

interface HeliusTokenAccount {
  owner: string;
  amount: number;
}

interface HeliusTokenResponse {
  result?: {
    token_accounts: HeliusTokenAccount[];
  };
}

/**
 * Fetches on-chain leaderboard data using Helius DAS API.
 * Returns all XP token holders sorted by balance descending.
 * Returns empty array if HELIUS_API_KEY or XP_MINT is not set.
 */
export async function getOnChainLeaderboard(): Promise<OnChainLeaderboardEntry[]> {
  const heliusApiKey = process.env.HELIUS_API_KEY;
  const xpMint = process.env.NEXT_PUBLIC_XP_MINT_ADDRESS;

  if (!heliusApiKey || !xpMint) {
    return [];
  }

  try {
    // Use Helius DAS API: getTokenAccounts to find all holders of XP mint
    const response = await fetch(
      `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "leaderboard",
          method: "getTokenAccounts",
          params: {
            mint: xpMint,
            page: 1,
            limit: 100,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Helius API error:", response.status, response.statusText);
      return [];
    }

    const data = (await response.json()) as HeliusTokenResponse;

    if (!data.result?.token_accounts) {
      return [];
    }

    return data.result.token_accounts
      .map((account) => ({
        walletAddress: account.owner,
        xpBalance: Number(account.amount) || 0,
      }))
      .sort((a, b) => b.xpBalance - a.xpBalance);
  } catch (error) {
    console.error("Failed to fetch on-chain leaderboard:", error);
    return [];
  }
}

// ============================================================================
// Credential Ownership Verification
// ============================================================================

interface HeliusAssetResponse {
  result?: {
    ownership?: {
      owner: string;
    };
  };
}

export interface VerificationResult {
  verified: boolean;
  currentOwner: string | null;
}

/**
 * Verifies if a credential (asset) is owned by the expected wallet address.
 * Uses Helius DAS API to fetch the current owner.
 * Returns { verified: false, currentOwner: null } if Helius API key is not set.
 */
export async function verifyCredentialOwnership(
  assetId: string,
  expectedOwner: string
): Promise<VerificationResult> {
  const heliusApiKey = process.env.HELIUS_API_KEY;

  if (!heliusApiKey) {
    return { verified: false, currentOwner: null };
  }

  try {
    const response = await fetch(
      `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "verify",
          method: "getAsset",
          params: { id: assetId },
        }),
      }
    );

    if (!response.ok) {
      console.error("Helius API error:", response.status, response.statusText);
      return { verified: false, currentOwner: null };
    }

    const data = (await response.json()) as HeliusAssetResponse;
    const currentOwner = data.result?.ownership?.owner || null;

    return {
      verified: currentOwner === expectedOwner,
      currentOwner,
    };
  } catch (error) {
    console.error("Failed to verify credential:", error);
    return { verified: false, currentOwner: null };
  }
}
