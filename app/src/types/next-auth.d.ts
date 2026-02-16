import "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      walletAddress?: string | null;
    };
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    walletAddress?: string | null;
  }
}
