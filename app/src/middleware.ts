import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n/request";

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/settings", "/profile"];

/**
 * Check if a pathname matches any protected route pattern
 * - /profile is protected (own profile)
 * - /profile/[username] is public (viewing others)
 */
function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix for checking
  const pathWithoutLocale = locales.reduce((path, locale) => {
    if (path.startsWith(`/${locale}`)) {
      return path.slice(locale.length + 1) || "/";
    }
    return path;
  }, pathname);

  // Check if it's a protected route
  return protectedRoutes.some((route) => {
    // Exact match for /profile (own profile)
    if (route === "/profile") {
      return pathWithoutLocale === "/profile" || pathWithoutLocale === "/profile/";
    }
    // For other routes, check if it starts with the protected path
    return pathWithoutLocale.startsWith(route);
  });
}

/**
 * Get the locale from the pathname
 */
function getLocaleFromPathname(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth checks for API routes, static files, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Run i18n middleware first to handle locale detection
  const intlResponse = intlMiddleware(request);

  // Check if this is a protected route
  if (isProtectedRoute(pathname)) {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to signin
    if (!token) {
      const locale = getLocaleFromPathname(pathname);
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      // Set callbackUrl to return after signin (without locale prefix for cleaner URL)
      const pathWithoutLocale = locales.reduce((path, loc) => {
        if (path.startsWith(`/${loc}`)) {
          return path.slice(loc.length + 1) || "/";
        }
        return path;
      }, pathname);
      signInUrl.searchParams.set("callbackUrl", pathWithoutLocale);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
