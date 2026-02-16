const SECRET_PATTERNS: RegExp[] = [
  /\b(?:seed phrase|mnemonic|private key|secret key)\b.*$/gim,
  /\[[0-9,\s]{20,}\]/g,
  /"(secret|privateKey|mnemonic)"\s*:\s*"[^"]+"/gi,
];

export function redactRunnerLogs(input: string): string {
  let output = input;
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, "[REDACTED]");
  }
  return output;
}
