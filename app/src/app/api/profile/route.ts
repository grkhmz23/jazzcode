import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { AchievementEngine } from "@/lib/services/achievements";
import { getCredentials } from "@/lib/services/onchain";
import type { AchievementWithStatus } from "@/types/achievements";

export interface ProfileResponse {
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  joinedAt: string;
  isPublic: boolean;
  primaryWallet: string | null;
  linkedWallets: string[];
  linkedProviders: string[];
  achievements: AchievementWithStatus[];
  credentials: CredentialData[];
}

interface CredentialData {
  mintAddress: string;
  trackId: string;
  trackName: string;
  level: number;
  acquiredAt: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user data with relations in parallel
    const [user, wallets, accounts, achievements] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
          isPublic: true,
        },
      }),
      prisma.userWallet.findMany({
        where: { userId },
        select: { address: true, isPrimary: true },
      }),
      prisma.account.findMany({
        where: { userId },
        select: { provider: true },
      }),
      new AchievementEngine().getAchievementsWithStatus(userId),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const primaryWallet = wallets.find((w: { isPrimary: boolean; address: string }) => w.isPrimary)?.address ?? null;
    const walletAddresses = wallets.map((w: { address: string }) => w.address);
    const linkedProviders = accounts.map((a: { provider: string }) => a.provider);

    const credentials = primaryWallet
      ? (await getCredentials(primaryWallet)).map((credential) => ({
          mintAddress: credential.mintAddress,
          trackId: credential.trackName.toLowerCase().replace(/\s+/g, "-"),
          trackName: credential.trackName || credential.name,
          level: Number.parseInt(credential.level, 10) || 1,
          acquiredAt: new Date().toISOString(),
        }))
      : [];

    const response: ProfileResponse = {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      joinedAt: user.createdAt.toISOString(),
      isPublic: user.isPublic ?? true,
      primaryWallet,
      linkedWallets: walletAddresses,
      linkedProviders,
      achievements,
      credentials,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
