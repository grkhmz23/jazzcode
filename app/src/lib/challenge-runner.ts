/**
 * Challenge Runner - Executes user code via server-side VM sandbox
 */

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  logs: string[];
  executionTime: number;
  error: string | null;
}

export interface RunResult {
  testResults: TestResult[];
  allPassed: boolean;
  totalTime: number;
  error: string | null;
}

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Run challenge tests in the sandbox API
 * @param code - User's code to execute
 * @param testCases - Array of test cases to run
 * @param timeoutMs - Maximum execution time per test (default: 5000ms)
 * @returns Promise<RunResult> - Results of all test executions
 */
export async function runChallengeTests(
  code: string,
  testCases: TestCase[],
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<RunResult> {
  const validation = validateCode(code);
  if (!validation.valid) {
    return {
      testResults: testCases.map((tc) => ({
        name: tc.name,
        passed: false,
        actualOutput: "",
        expectedOutput: tc.expectedOutput,
        logs: [],
        executionTime: 0,
        error: validation.error ?? "Blocked by sandbox policy",
      })),
      allPassed: false,
      totalTime: 0,
      error: validation.error ?? "Blocked by sandbox policy",
    };
  }

  const response = await fetch("/api/challenge/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      testCases,
      timeoutMs,
    }),
  });

  const payload = (await response.json()) as
    | RunResult
    | {
        error?: string;
      };

  if (!response.ok) {
    return {
      testResults: [],
      allPassed: false,
      totalTime: 0,
      error: "error" in payload && payload.error ? payload.error : "Challenge run failed",
    };
  }

  return payload as RunResult;
}

/**
 * Check if code contains potentially dangerous patterns
 * Basic static analysis for common attack vectors
 */
export function validateCode(code: string): { valid: boolean; error?: string } {
  // Keep client-side preflight aligned with server-side sandbox validation.
  const dangerousPatterns = [
    { pattern: /\beval\s*\(/i, message: "eval() is not allowed" },
    { pattern: /\bFunction\s*\(/, message: "Function constructor is not allowed" },
    { pattern: /\bfetch\s*\(/i, message: "fetch() is not allowed" },
    { pattern: /\bXMLHttpRequest\b/i, message: "XMLHttpRequest is not allowed" },
    { pattern: /\bimportScripts\s*\(/i, message: "importScripts is not allowed" },
    { pattern: /\bWebSocket\s*\(/i, message: "WebSocket is not allowed" },
    { pattern: /\.\s*constructor\s*\(/i, message: "Constructor escape pattern is not allowed" },
    { pattern: /\[\s*["']constructor["']\s*\]\s*\(/i, message: "Constructor escape pattern is not allowed" },
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      return { valid: false, error: message };
    }
  }

  return { valid: true };
}
