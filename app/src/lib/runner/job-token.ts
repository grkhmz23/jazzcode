import { createHmac, timingSafeEqual } from "node:crypto";

type JobTokenPayload = {
  j: string;
  a: string;
  e: number;
};

function getSigningSecret(): string {
  return (
    process.env.RUNNER_SHARED_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET ??
    ""
  );
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("hex");
}

export function createRunnerJobAccessToken(
  jobId: string,
  actorId: string,
  ttlSeconds = 15 * 60
): string {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error("Runner job token secret is not configured");
  }

  const payload: JobTokenPayload = {
    j: jobId,
    a: actorId,
    e: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyRunnerJobAccessToken(
  token: string,
  actorId: string
): { valid: boolean; jobId?: string } {
  const secret = getSigningSecret();
  if (!secret) {
    return { valid: false };
  }

  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) {
    return { valid: false };
  }

  const expectedSignature = sign(encoded, secret);
  const provided = Buffer.from(providedSignature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return { valid: false };
  }

  let payload: JobTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encoded)) as JobTokenPayload;
  } catch {
    return { valid: false };
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload?.j || !payload?.a || !payload?.e || payload.e <= now) {
    return { valid: false };
  }
  if (payload.a !== actorId) {
    return { valid: false };
  }

  return { valid: true, jobId: payload.j };
}
