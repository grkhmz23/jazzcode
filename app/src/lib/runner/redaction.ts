const SECRET_PATTERNS: RegExp[] = [
  /\b(?:seed phrase|mnemonic|private key|secret key)\b.*$/gim,
  /\[[0-9,\s]{80,}\]/g,
  /"(secret|privateKey|mnemonic)"\s*:\s*"[^"]+"/gi,
  /(?:^|\s)(?:\/home\/[^/\s]+\/\.config\/solana\/id\.json|~\/\.config\/solana\/id\.json)(?:\s|$)/gi,
  /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
];

export function redactRunnerLogs(input: string): string {
  let output = input;
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, "[REDACTED]");
  }
  return output;
}
