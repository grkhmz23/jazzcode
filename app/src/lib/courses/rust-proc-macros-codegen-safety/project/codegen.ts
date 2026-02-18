export type ConstraintKind = "signer" | "owner" | "has_one" | "mut";

export interface ConstraintNode {
  kind: ConstraintKind;
  target: string;
  expected?: string;
}

export interface CheckInput {
  signers: string[];
  owners: Record<string, string>;
  relations: Record<string, string>;
  mutableAccounts: string[];
}

export interface CheckFailure {
  kind: ConstraintKind;
  target: string;
  reason: string;
}

export interface GeneratedCheckResult {
  ok: boolean;
  failures: CheckFailure[];
}

export function parseAttributes(miniDsl: string): ConstraintNode[] {
  const lines = miniDsl
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const nodes: ConstraintNode[] = [];
  for (const line of lines) {
    const match = line.match(/^([a-z_]+)\((.*)\)$/);
    if (!match) {
      throw new Error(`invalid DSL line: ${line}`);
    }
    const kindRaw = match[1] as ConstraintKind;
    if (!["signer", "owner", "has_one", "mut"].includes(kindRaw)) {
      throw new Error(`unsupported constraint kind: ${match[1]}`);
    }

    const body = match[2].trim();
    if (body.length === 0) {
      throw new Error(`empty constraint body: ${line}`);
    }

    if (kindRaw === "signer" || kindRaw === "mut") {
      nodes.push({ kind: kindRaw, target: body });
      continue;
    }

    const parts = body.split("=").map((part) => part.trim());
    if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
      throw new Error(`invalid assignment constraint: ${line}`);
    }
    nodes.push({ kind: kindRaw, target: parts[0], expected: parts[1] });
  }

  return nodes;
}

export function generateChecks(ast: ConstraintNode[]): string {
  const lines = ast.map((node) => {
    if (node.kind === "signer") {
      return `require_signer(${node.target});`;
    }
    if (node.kind === "mut") {
      return `require_mut(${node.target});`;
    }
    if (node.kind === "owner") {
      return `require_owner(${node.target}, ${node.expected});`;
    }
    return `require_has_one(${node.target}, ${node.expected});`;
  });

  return lines.join("\n");
}

export function runGeneratedChecks(ast: ConstraintNode[], input: CheckInput): GeneratedCheckResult {
  const failures: CheckFailure[] = [];
  for (const node of ast) {
    if (node.kind === "signer") {
      if (!input.signers.includes(node.target)) {
        failures.push({
          kind: "signer",
          target: node.target,
          reason: `missing signer: ${node.target}`,
        });
      }
      continue;
    }

    if (node.kind === "mut") {
      if (!input.mutableAccounts.includes(node.target)) {
        failures.push({
          kind: "mut",
          target: node.target,
          reason: `account is not writable: ${node.target}`,
        });
      }
      continue;
    }

    if (!node.expected) {
      failures.push({
        kind: node.kind,
        target: node.target,
        reason: "expected value missing",
      });
      continue;
    }

    if (node.kind === "owner") {
      if (input.owners[node.target] !== node.expected) {
        failures.push({
          kind: "owner",
          target: node.target,
          reason: `owner mismatch: expected ${node.expected}`,
        });
      }
      continue;
    }

    if (input.relations[node.target] !== node.expected) {
      failures.push({
        kind: "has_one",
        target: node.target,
        reason: `relation mismatch: expected ${node.expected}`,
      });
    }
  }

  return { ok: failures.length === 0, failures };
}

export function generatedSafetyReport(result: GeneratedCheckResult): string {
  const lines = [
    "# Generated Safety Report",
    "",
    `- Status: ${result.ok ? "PASS" : "FAIL"}`,
    `- Failure count: ${result.failures.length}`,
  ];

  for (const failure of result.failures) {
    lines.push(`- [${failure.kind}] ${failure.target}: ${failure.reason}`);
  }

  return lines.join("\n");
}
