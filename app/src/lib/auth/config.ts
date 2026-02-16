import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { AdapterAccount } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db/client";
import { verifyWalletAuth } from "@/lib/auth/wallet-verify";
import { isDevelopment, isProduction } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  walletAddress?: string | null;
}

function validateAuthEnv(): void {
  if (
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.SKIP_ENV_VALIDATION === "1"
  ) {
    return;
  }

  if (isProduction()) {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error("NEXTAUTH_SECRET is required in production");
    }
    if (process.env.NEXTAUTH_SECRET.length < 32) {
      throw new Error("NEXTAUTH_SECRET must be at least 32 characters");
    }
  }
}

validateAuthEnv();

function mapUserToAdapterUser(user: {
  id: string;
  email: string | null;
  emailVerified: Date | null;
  displayName: string | null;
  avatarUrl: string | null;
}): AdapterUser {
  return {
    id: user.id,
    email: user.email ?? `${user.id}@wallet.local`,
    emailVerified: user.emailVerified,
    name: user.displayName,
    image: user.avatarUrl,
  };
}

function createCompatPrismaAdapter(): Adapter {
  const base = PrismaAdapter(prisma) as Adapter;

  return {
    ...base,
    async createUser(data: AdapterUser) {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          displayName: data.name ?? null,
          avatarUrl: data.image ?? null,
        },
      });
      return mapUserToAdapterUser(user);
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const user = await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data.email,
          emailVerified: data.emailVerified,
          displayName: data.name ?? null,
          avatarUrl: data.image ?? null,
        },
      });
      return mapUserToAdapterUser(user);
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          displayName: true,
          avatarUrl: true,
        },
      });
      return user ? mapUserToAdapterUser(user) : null;
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          displayName: true,
          avatarUrl: true,
        },
      });
      return user ? mapUserToAdapterUser(user) : null;
    },
    async getUserByAccount({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });
      if (!account?.user) return null;
      return mapUserToAdapterUser(account.user);
    },
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });
      if (!session) {
        return null;
      }
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
        user: mapUserToAdapterUser(session.user),
      };
    },
  };
}

function buildProviders(): AuthOptions["providers"] {
  const providers: AuthOptions["providers"] = [
    CredentialsProvider({
      id: "solana-wallet",
      name: "Solana Wallet",
      credentials: {
        address: { label: "Address", type: "text" },
        signature: { label: "Signature", type: "text" },
        nonce: { label: "Nonce", type: "text" },
      },
      authorize: async (credentials) => {
        const address = credentials?.address;
        const signature = credentials?.signature;
        const nonce = credentials?.nonce;

        if (!address || !signature || !nonce) {
          logger.warn("Wallet authorize missing fields");
          return null;
        }

        const verification = await verifyWalletAuth({
          address,
          signature,
          nonce,
        });

        if (!verification.ok) {
          logger.warn("Wallet authorize rejected", { reason: verification.error });
          return null;
        }

        let user = await prisma.user.findUnique({
          where: { walletAddress: address },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              walletAddress: address,
              displayName: `${address.slice(0, 4)}...${address.slice(-4)}`,
              wallets: {
                create: {
                  address,
                  isPrimary: true,
                },
              },
            },
          });
        } else {
          await prisma.userWallet.upsert({
            where: { address },
            create: {
              address,
              userId: user.id,
              isPrimary: true,
            },
            update: {
              userId: user.id,
              isPrimary: true,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          image: user.avatarUrl,
          walletAddress: user.walletAddress,
        };
      },
    }),
  ];

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  } else {
    logger.warn(
      "GitHub OAuth not configured - GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing"
    );
  }

  return providers;
}

export const authOptions: AuthOptions = {
  adapter: createCompatPrismaAdapter(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: buildProviders(),
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id && !token.walletAddress) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { walletAddress: true, displayName: true, avatarUrl: true },
        });
        if (dbUser) {
          token.walletAddress = dbUser.walletAddress;
          if (!token.name && dbUser.displayName) {
            token.name = dbUser.displayName;
          }
          if (!token.picture && dbUser.avatarUrl) {
            token.picture = dbUser.avatarUrl;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.id as string;
        (session.user as SessionUser).walletAddress =
          (token.walletAddress as string | null | undefined) ?? null;
      }
      return session;
    },
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  debug: isDevelopment(),
};
