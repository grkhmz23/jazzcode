"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client-side auth guard for pages that require authentication.
 * Shows a loading state while checking auth, then either renders children
 * or redirects to sign-in.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If unauthenticated after loading completes, redirect to signin
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  // Show loading state while checking authentication
  if (status === "loading") {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If authenticated, render children
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Return null while redirecting (unauthenticated state)
  return null;
}
