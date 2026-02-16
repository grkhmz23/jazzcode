import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AuthOptions, SessionStrategy } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db/client";
import { isProduction, isDevelopment } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

/**
 * Session user type with ID
 */
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  walletAddress?: string | null;
}

/**
 * Extended session type
 */
export interface ExtendedSession {
  user?: SessionUser;
  expires: string;
}

/**
 * Validate that required auth environment variables are set
 */
function validateAuthEnv(): void {
  // Allow skipping validation in CI builds (accepts "true" or "1")
  if (process.env.SKIP_ENV_VALIDATION === "true" || process.env.SKIP_ENV_VALIDATION === "1") {
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

// Validate on module load
validateAuthEnv();

/**
 * Build providers array based on environment variables
 * Only includes providers that are configured
 */
function buildProviders(): AuthOptions["providers"] {
  const providers: AuthOptions["providers"] = [];
  
  // Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Only allow specific domains if needed
        // authorization: { params: { hd: "example.com" } },
      })
    );
  } else if (isProduction()) {
    logger.warn("Google OAuth not configured - GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing");
  }
  
  // GitHub OAuth
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  } else if (isProduction()) {
    logger.warn("GitHub OAuth not configured - GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing");
  }
  
  return providers;
}

/**
 * Get cookie configuration based on environment
 */
function getCookieConfig() {
  const isProd = isProduction();
  
  return {
    sessionToken: {
      name: `${isProd ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: isProd,
        // In production, you may want to set domain
        // domain: isProd ? ".yourdomain.com" : undefined,
      },
    },
    callbackUrl: {
      name: `${isProd ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: isProd,
      },
    },
    csrfToken: {
      name: `${isProd ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: isProd,
      },
    },
  };
}

/**
 * NextAuth configuration
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  
  // Use database sessions for better security
  // JWT sessions are stateless but harder to revoke
  session: {
    strategy: "database" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  providers: buildProviders(),
  
  cookies: getCookieConfig(),
  
  callbacks: {
    /**
     * Session callback - called whenever a session is checked
     * Be careful not to expose sensitive data here
     */
    session: async ({ session, user }) => {
      if (session.user && user) {
        // Only expose minimal user data
        (session.user as SessionUser).id = user.id;
        
        // Fetch wallet address from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { walletAddress: true },
        });
        
        if (dbUser) {
          (session.user as SessionUser).walletAddress = dbUser.walletAddress;
        }
        
        // Log session access in production for audit
        if (isProduction()) {
          logger.debug("Session accessed", { userId: user.id });
        }
      }
      return session;
    },
    
    /**
     * Sign in callback - called when user attempts to sign in
     * Can be used to restrict access based on email domain, etc.
     */
    signIn: async ({ user, account }) => {
      // Log sign-in attempts
      logger.info("Sign in attempt", {
        email: user.email,
        provider: account?.provider,
      });
      
      // Allow all sign-ins (add restrictions here if needed)
      return true;
    },
    
    /**
     * Redirect callback - called when redirecting after sign in
     * Prevents open redirect vulnerabilities
     */
    redirect: async ({ url, baseUrl }) => {
      // Only allow redirects to same site
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Default to base URL
      return baseUrl;
    },
  },
  
  events: {
    /**
     * Called when a user signs in
     */
    signIn: async ({ user, account }) => {
      logger.info("User signed in", {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
      });
    },
    
    /**
     * Called when a user signs out
     */
    signOut: async ({ token }) => {
      logger.info("User signed out", { userId: token?.sub });
    },
    
    /**
     * Called when a session is created
     */
    createUser: async ({ user }) => {
      logger.info("New user created", { userId: user.id, email: user.email });
    },
  },
  
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  
  // Debug logging in development
  debug: isDevelopment(),
  
  // Custom logger that uses our structured logger
  logger: {
    error: (code, metadata) => {
      logger.error("NextAuth error", { code, metadata });
    },
    warn: (code) => {
      logger.warn("NextAuth warning", { code });
    },
    debug: (code, metadata) => {
      if (isDevelopment()) {
        logger.debug("NextAuth debug", { code, metadata });
      }
    },
  },
};
