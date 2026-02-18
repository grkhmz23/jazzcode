/**
 * Challenge Runner - Executes user code in a sandboxed Web Worker
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
 * Run challenge tests in a sandboxed Web Worker
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
  return new Promise((resolve) => {
    let worker: Worker | null = null;
    const startTime = Date.now();

    // Create timeout handler
    const timeoutId = setTimeout(() => {
      if (worker) {
        worker.terminate();
        worker = null;
      }

      resolve({
        testResults: testCases.map((tc) => ({
          name: tc.name,
          passed: false,
          actualOutput: "",
          expectedOutput: tc.expectedOutput,
          logs: [],
          executionTime: timeoutMs,
          error: `Execution timed out (${timeoutMs / 1000}s limit)`,
        })),
        allPassed: false,
        totalTime: timeoutMs,
        error: `Execution timed out after ${timeoutMs / 1000} seconds`,
      });
    }, timeoutMs);

    try {
      // Create the worker
      worker = new Worker("/challenge-worker.js");

      worker.onmessage = (e: MessageEvent<{ type: string; results?: TestResult[]; error?: string }>) => {
        clearTimeout(timeoutId);

        if (worker) {
          worker.terminate();
          worker = null;
        }

        if (e.data.type === "error") {
          resolve({
            testResults: [],
            allPassed: false,
            totalTime: Date.now() - startTime,
            error: e.data.error || "Worker error",
          });
          return;
        }

        const results = e.data.results || [];
        const error =
          results.length === 0 ? "Runner returned no test results. Check challenge entrypoint configuration." : null;
        resolve({
          testResults: results,
          allPassed: results.every((r) => r.passed),
          totalTime: Date.now() - startTime,
          error,
        });
      };

      worker.onerror = (e: ErrorEvent) => {
        clearTimeout(timeoutId);

        if (worker) {
          worker.terminate();
          worker = null;
        }

        resolve({
          testResults: [],
          allPassed: false,
          totalTime: Date.now() - startTime,
          error: e.message || "Worker error",
        });
      };

      // Send the code and test cases to the worker
      worker.postMessage({
        code,
        testCases,
        timeoutMs,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      if (worker) {
        worker.terminate();
        worker = null;
      }

      resolve({
        testResults: [],
        allPassed: false,
        totalTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Failed to create worker",
      });
    }
  });
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
