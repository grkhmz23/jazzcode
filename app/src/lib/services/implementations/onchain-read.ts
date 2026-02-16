import { OnChainReadError } from "@/types";
import type { Credential, LeaderboardEntry, LeaderboardTimeframe } from "@/types";
import type { OnChainReadService } from "../interfaces";

export class OnChainReadServiceImpl implements OnChainReadService {
  async getXPBalance(wallet: string): Promise<number> {
    void wallet;
    // Placeholder - would read from Solana program
    throw new OnChainReadError("XP balance read not yet implemented");
  }

  async getLeaderboardFromDAS(timeframe: LeaderboardTimeframe): Promise<LeaderboardEntry[]> {
    void timeframe;
    // Placeholder - would read from DAS API
    throw new OnChainReadError("Leaderboard read from DAS not yet implemented");
  }

  async getCredentialsFromDAS(wallet: string): Promise<Credential[]> {
    void wallet;
    // Placeholder - would read from DAS API
    throw new OnChainReadError("Credentials read from DAS not yet implemented");
  }

  async verifyCredentialOnChain(mintAddress: string): Promise<boolean> {
    void mintAddress;
    // Placeholder - would verify on Solana
    throw new OnChainReadError("Credential verification not yet implemented");
  }
}

export const onChainReadService = new OnChainReadServiceImpl();
