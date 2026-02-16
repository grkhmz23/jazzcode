import "next-auth";
import "next-auth/jwt";

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

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    walletAddress?: string | null;
  }
}
