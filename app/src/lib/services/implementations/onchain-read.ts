import type { OnChainReadService } from "../interfaces";
import type { LeaderboardEntry, LeaderboardTimeframe, Credential } from "@/types";
import { OnChainReadError } from "@/types";

/**
 * On-chain read service implementation
 * Currently returns placeholder data as on-chain integration is not yet implemented
 */
export class OnChainReadServiceImpl implements OnChainReadService {
  async getXPBalance(wallet: string): Promise<number> {
    void wallet;
    throw new OnChainReadError("getXPBalance not implemented");
  }

  async getLeaderboardFromDAS(
    timeframe: LeaderboardTimeframe
  ): Promise<LeaderboardEntry[]> {
    void timeframe;
    throw new OnChainReadError("getLeaderboardFromDAS not implemented");
  }

  async getCredentialsFromDAS(wallet: string): Promise<Credential[]> {
    void wallet;
    throw new OnChainReadError("getCredentialsFromDAS not implemented");
  }

  async verifyCredentialOnChain(mintAddress: string): Promise<boolean> {
    void mintAddress;
    throw new OnChainReadError("verifyCredentialOnChain not implemented");
  }
}
