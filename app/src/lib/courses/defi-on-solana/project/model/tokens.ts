import type { TokenInfo } from "../types";

export function tokenMap(tokens: TokenInfo[]): Map<string, TokenInfo> {
  const map = new Map<string, TokenInfo>();
  for (const token of tokens) {
    map.set(token.mint, token);
  }
  return map;
}

export function requireToken(tokens: Map<string, TokenInfo>, mint: string): TokenInfo {
  const token = tokens.get(mint);
  if (!token) {
    throw new Error(`Unknown token mint: ${mint}`);
  }
  return token;
}
