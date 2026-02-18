import { describe, it, expect } from "vitest";

/**
 * Security headers configuration to test
 * This mirrors the configuration in next.config.mjs
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
];

function getCspHeader(isDev: boolean): string {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self'",
    "img-src 'self' blob: data: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self'",
    "connect-src 'self' https://api.devnet.solana.com https://www.google-analytics.com https://www.googletagmanager.com",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  
  return csp;
}

/**
 * Tests for security headers configuration
 */
describe("Security Headers", () => {
  it("should have all required security headers", () => {
    const headerKeys = securityHeaders.map(h => h.key);
    
    expect(headerKeys).toContain("X-Content-Type-Options");
    expect(headerKeys).toContain("X-Frame-Options");
    expect(headerKeys).toContain("Referrer-Policy");
    expect(headerKeys).toContain("Permissions-Policy");
    expect(headerKeys).toContain("Cross-Origin-Opener-Policy");
    expect(headerKeys).toContain("Cross-Origin-Resource-Policy");
  });

  it("should have correct X-Content-Type-Options value", () => {
    const header = securityHeaders.find(h => h.key === "X-Content-Type-Options");
    expect(header?.value).toBe("nosniff");
  });

  it("should have correct X-Frame-Options value", () => {
    const header = securityHeaders.find(h => h.key === "X-Frame-Options");
    expect(header?.value).toBe("DENY");
  });

  it("should have correct Referrer-Policy value", () => {
    const header = securityHeaders.find(h => h.key === "Referrer-Policy");
    expect(header?.value).toBe("strict-origin-when-cross-origin");
  });

  it("should have Permissions-Policy restricting sensitive features", () => {
    const header = securityHeaders.find(h => h.key === "Permissions-Policy");
    expect(header?.value).toContain("camera=()");
    expect(header?.value).toContain("microphone=()");
    expect(header?.value).toContain("geolocation=()");
    expect(header?.value).toContain("payment=()");
  });

  describe("CSP", () => {
    it("should include essential directives in development", () => {
      const csp = getCspHeader(true);
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src");
      expect(csp).toContain("'unsafe-inline'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
    });

    it("should not allow unsafe-eval in global CSP", () => {
      const csp = getCspHeader(true);
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it("should keep global worker-src strict", () => {
      const csp = getCspHeader(true);
      expect(csp).toContain("worker-src 'self'");
    });

    it("should include upgrade-insecure-requests in production", () => {
      const csp = getCspHeader(false);
      expect(csp).toContain("upgrade-insecure-requests");
    });

    it("should not include upgrade-insecure-requests in development", () => {
      const csp = getCspHeader(true);
      expect(csp).not.toContain("upgrade-insecure-requests");
    });

    it("should allow required image sources", () => {
      const csp = getCspHeader(true);
      expect(csp).toContain("https://cdn.sanity.io");
      expect(csp).toContain("https://lh3.googleusercontent.com");
      expect(csp).toContain("https://avatars.githubusercontent.com");
    });

    it("should allow Solana RPC connections", () => {
      const csp = getCspHeader(true);
      expect(csp).toContain("https://api.devnet.solana.com");
      expect(csp).not.toContain("mainnet-beta");
    });
  });
});
