import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

/**
 * User data returned from getCurrentUser
 */
export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  walletAddress?: string | null;
}

/**
 * Get current session in server components
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    walletAddress: session.user.walletAddress,
  };
}

/**
 * Require auth — redirects to signin if not authenticated
 * Returns the current user if authenticated
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}
