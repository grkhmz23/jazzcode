import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getClientIp } from "@/lib/api/middleware";

function hashValue(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

export async function resolveRequestActorId(request: NextRequest): Promise<string> {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token?.sub) {
    return `user:${token.sub}`;
  }

  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") ?? "unknown";
  return `guest:${hashValue(`${ip}:${ua}`)}`;
}
