/**
 * Structural Checker - Validates Rust/Anchor code against expected patterns
 * Since we cannot execute Rust in the browser, we validate code structure
 */

export interface StructuralCheck {
  name: string;
  description: string;
  check: (code: string) => boolean;
}

export interface StructuralCheckResult {
  name: string;
  description: string;
  passed: boolean;
}

/**
 * Extract function signatures from Rust code
 */
function extractFunctionSignatures(code: string): string[] {
  const signatures: string[] = [];

  // Match pub fn declarations - function name followed by optional generics and (
  const pubFnRegex = /pub\s+fn\s+(\w+)(?:<[^>]*>)?\s*\(/g;
  let match;
  while ((match = pubFnRegex.exec(code)) !== null) {
    signatures.push(match[1]);
  }

  // Match regular fn declarations (inside #[program])
  const fnRegex = /fn\s+(\w+)(?:<[^>]*>)?\s*\(/g;
  while ((match = fnRegex.exec(code)) !== null) {
    // Avoid duplicates from pub fn matches
    if (!signatures.includes(match[1])) {
      signatures.push(match[1]);
    }
  }

  return signatures;
}

/**
 * Extract struct definitions from Rust code
 */
function extractStructDefinitions(code: string): string[] {
  const structs: string[] = [];
  const regex = /pub\s+struct\s+(\w+)|struct\s+(\w+)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const name = match[1] || match[2];
    if (name && !structs.includes(name)) {
      structs.push(name);
    }
  }
  return structs;
}

/**
 * Extract enum definitions from Rust code
 */
function extractEnumDefinitions(code: string): string[] {
  const enums: string[] = [];
  const regex = /pub\s+enum\s+(\w+)|enum\s+(\w+)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const name = match[1] || match[2];
    if (name && !enums.includes(name)) {
      enums.push(name);
    }
  }
  return enums;
}

/**
 * Detect Anchor macros in code
 */
function detectAnchorMacros(code: string): string[] {
  const macros = [
    "#[program]",
    "#[derive(Accounts)]",
    "#[account]",
    "#[error_code]",
    "#[event]",
    "#[instruction]",
  ];

  return macros.filter((macro) => code.includes(macro));
}

/**
 * Detect common Anchor constraint keywords
 */
function detectConstraints(code: string): string[] {
  const constraints = [
    "init",
    "mut",
    "seeds",
    "bump",
    "payer",
    "space",
    "constraint",
    "has_one",
    "address",
    "owner",
  ];

  return constraints.filter((constraint) => {
    // Match constraint keywords in account definitions
    const regex = new RegExp(`\\b${constraint}\\s*=|\\b${constraint}\\b`, "i");
    return regex.test(code);
  });
}

/**
 * Detect validation patterns
 */
function detectValidationPatterns(code: string): string[] {
  const patterns: string[] = [];

  // require! macro
  if (code.includes("require!")) {
    patterns.push("require!");
  }

  // assert! macro
  if (code.includes("assert!")) {
    patterns.push("assert!");
  }

  // Result return type
  if (/Result\s*<|->\s*Result/.test(code)) {
    patterns.push("Result return type");
  }

  // ok() and err()
  if (code.includes(".ok()") || code.includes("Ok(")) {
    patterns.push("Ok() usage");
  }
  if (code.includes(".err()") || code.includes("Err(")) {
    patterns.push("Err() usage");
  }

  return patterns;
}

/**
 * Detect account context usage patterns
 */
function detectContextPatterns(code: string): string[] {
  const patterns: string[] = [];

  // ctx.accounts access
  if (/ctx\.accounts\.\w+/.test(code)) {
    patterns.push("ctx.accounts access");
  }

  // ctx.program_id
  if (code.includes("ctx.program_id")) {
    patterns.push("ctx.program_id usage");
  }

  // ctx.bumps
  if (code.includes("ctx.bumps")) {
    patterns.push("ctx.bumps usage");
  }

  // CpiContext
  if (code.includes("CpiContext")) {
    patterns.push("CPI usage");
  }

  // invoke_signed
  if (code.includes("invoke_signed")) {
    patterns.push("invoke_signed");
  }

  return patterns;
}

/**
 * Detect system program interactions
 */
function detectSystemProgramUsage(code: string): string[] {
  const patterns: string[] = [];

  if (code.includes("SystemProgram::transfer")) {
    patterns.push("SystemProgram::transfer");
  }

  if (code.includes("system_instruction::transfer")) {
    patterns.push("system_instruction::transfer");
  }

  // Check for system_program module usage
  if (/system_program::\w+/.test(code)) {
    patterns.push("system_program usage");
  }

  if (code.includes("rent") || code.includes("Rent::")) {
    patterns.push("Rent sysvar usage");
  }

  if (code.includes("clock") || code.includes("Clock::")) {
    patterns.push("Clock sysvar usage");
  }

  return patterns;
}

/**
 * Generate structural checks based on solution code
 */
export function generateStructuralChecks(solution: string): StructuralCheck[] {
  const checks: StructuralCheck[] = [];

  // Extract and check function signatures
  const solutionFunctions = extractFunctionSignatures(solution);
  for (const fnName of solutionFunctions) {
    // Skip common boilerplate functions that might not be required
    if (["new", "default"].includes(fnName)) {
      continue;
    }

    checks.push({
      name: `Function "${fnName}" defined`,
      description: `Your code should define a function called "${fnName}"`,
      check: (code) => {
        const regex = new RegExp(`\\bfn\\s+${fnName}(?:\\s*<[^>]*>)?\\s*\\(`, "i");
        return regex.test(code);
      },
    });
  }

  // Extract and check struct definitions
  const solutionStructs = extractStructDefinitions(solution);
  for (const structName of solutionStructs) {
    checks.push({
      name: `Struct "${structName}" defined`,
      description: `Your code should define a struct called "${structName}"`,
      check: (code) => {
        const regex = new RegExp(`\\bstruct\\s+${structName}\\b`, "i");
        return regex.test(code);
      },
    });
  }

  // Extract and check enum definitions
  const solutionEnums = extractEnumDefinitions(solution);
  for (const enumName of solutionEnums) {
    checks.push({
      name: `Enum "${enumName}" defined`,
      description: `Your code should define an enum called "${enumName}"`,
      check: (code) => {
        const regex = new RegExp(`\\benum\\s+${enumName}\\b`, "i");
        return regex.test(code);
      },
    });
  }

  // Check for Anchor macros
  const solutionMacros = detectAnchorMacros(solution);
  for (const macro of solutionMacros) {
    checks.push({
      name: `Uses ${macro}`,
      description: `Your code should include the ${macro} macro`,
      check: (code) => code.includes(macro),
    });
  }

  // Check for constraints if solution uses them
  const solutionConstraints = detectConstraints(solution);
  if (solutionConstraints.length > 0) {
    checks.push({
      name: "Account constraints",
      description: `Your code should use account constraints like: ${solutionConstraints.join(", ")}`,
      check: (code) => {
        const codeConstraints = detectConstraints(code);
        // Check that at least some constraints are present
        return solutionConstraints.some((sc) => codeConstraints.includes(sc));
      },
    });
  }

  // Check for validation patterns if solution uses them
  const solutionValidations = detectValidationPatterns(solution);
  if (solutionValidations.length > 0) {
    checks.push({
      name: "Input validation",
      description: "Your code should include validation checks (require!, assert!, etc.)",
      check: (code) => {
        const codeValidations = detectValidationPatterns(code);
        return codeValidations.length > 0;
      },
    });
  }

  // Check for context patterns if solution uses them
  const solutionContextPatterns = detectContextPatterns(solution);
  if (solutionContextPatterns.length > 0) {
    checks.push({
      name: "Context usage",
      description: "Your code should access context and accounts correctly",
      check: (code) => {
        const codePatterns = detectContextPatterns(code);
        return codePatterns.length > 0;
      },
    });
  }

  // Check for system program interactions
  const solutionSystemUsage = detectSystemProgramUsage(solution);
  if (solutionSystemUsage.length > 0) {
    checks.push({
      name: "System program usage",
      description: "Your code should interact with the system program correctly",
      check: (code) => {
        const codeUsage = detectSystemProgramUsage(code);
        return solutionSystemUsage.every((pattern) => codeUsage.includes(pattern));
      },
    });
  }

  // Check for specific state mutations
  if (/ctx\.accounts\.\w+\.\w+\s*\+?=/.test(solution)) {
    checks.push({
      name: "State mutation",
      description: "Your code should modify account state",
      check: (code) => /ctx\.accounts\.\w+\.\w+\s*\+?=/.test(code),
    });
  }

  return checks;
}

/**
 * Run structural checks against user code
 */
export function runStructuralChecks(
  code: string,
  solution: string
): StructuralCheckResult[] {
  const checks = generateStructuralChecks(solution);

  return checks.map((check) => ({
    name: check.name,
    description: check.description,
    passed: check.check(code),
  }));
}

/**
 * Validate that code is non-empty and looks like Rust
 */
export function validateRustCode(code: string): {
  valid: boolean;
  error?: string;
} {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: "Code cannot be empty" };
  }

  // Basic check that it looks like Rust (has fn, struct, use, or mod)
  const rustPatterns = [/\bfn\s+\w+/, /\bstruct\s+\w+/, /\buse\s+\w+/, /\bmod\s+\w+/];
  const hasRustPattern = rustPatterns.some((pattern) => pattern.test(code));

  if (!hasRustPattern) {
    return {
      valid: false,
      error: "Code does not appear to be valid Rust (missing fn, struct, use, or mod)",
    };
  }

  return { valid: true };
}
