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
  // Check for import statements that could try to load external scripts
  const dangerousPatterns = [
    { pattern: /import\s*\(/, message: "Dynamic imports are not allowed" },
    { pattern: /import\s+.*\s+from\s+['"]/, message: "Module imports are not allowed" },
    { pattern: /require\s*\(/, message: "CommonJS requires are not allowed" },
    { pattern: /eval\s*\(/, message: "eval() is not allowed" },
    { pattern: /Function\s*\(/, message: "Function constructor is not allowed" },
    { pattern: /setInterval\s*\(/, message: "setInterval is not allowed (use setTimeout instead)" },
    { pattern: /Worker\s*\(/, message: "Creating Workers is not allowed" },
    { pattern: /fetch\s*\(/, message: "fetch() is not allowed" },
    { pattern: /XMLHttpRequest/, message: "XMLHttpRequest is not allowed" },
    { pattern: /WebSocket\s*\(/, message: "WebSocket is not allowed" },
    { pattern: /\.\s*constructor\s*\(/, message: "Constructor escape patterns are not allowed" },
    { pattern: /\[\s*["']constructor["']\s*\]\s*\(/, message: "Constructor escape patterns are not allowed" },
    { pattern: /localStorage/, message: "localStorage access is not allowed" },
    { pattern: /sessionStorage/, message: "sessionStorage access is not allowed" },
    { pattern: /indexedDB/, message: "indexedDB access is not allowed" },
    { pattern: /document\./, message: "DOM access is not allowed" },
    { pattern: /window\./, message: "Window access is not allowed" },
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      return { valid: false, error: message };
    }
  }

  return { valid: true };
}
