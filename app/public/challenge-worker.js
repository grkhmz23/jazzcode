/* eslint-disable no-restricted-globals */

// Sandboxed execution: block network and dynamic imports.
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;

const DEFAULT_TIMEOUT_MS = 5000;

function createMockConsole() {
  const logs = [];
  return {
    console: {
      log: (...args) => logs.push(args.map((arg) => String(arg)).join(" ")),
      error: (...args) =>
        logs.push(`[ERROR] ${args.map((arg) => String(arg)).join(" ")}`),
      warn: (...args) =>
        logs.push(`[WARN] ${args.map((arg) => String(arg)).join(" ")}`),
      info: (...args) =>
        logs.push(`[INFO] ${args.map((arg) => String(arg)).join(" ")}`),
    },
    logs,
  };
}

function runWithTimeout(testFn, timeoutMs) {
  return Promise.race([
    Promise.resolve().then(testFn),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Execution timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

function parseInput(rawInput) {
  if (typeof rawInput !== "string") {
    return rawInput;
  }

  try {
    return JSON.parse(rawInput);
  } catch {
    return rawInput;
  }
}

async function runTest(code, testCase, timeoutMs) {
  const { console: mockConsole, logs } = createMockConsole();

  try {
    const input = parseInput(testCase.input);

    const execute = new Function(
      "console",
      "input",
      `${code}\n//# sourceURL=challenge-user-code.js`
    );

    const value = await runWithTimeout(() => execute(mockConsole, input), timeoutMs);
    const actualOutput =
      value !== undefined ? String(value) : logs.join("\n");
    const expectedOutput = String(testCase.expectedOutput ?? "");

    return {
      name: testCase.name,
      passed: actualOutput.trim() === expectedOutput.trim(),
      actualOutput,
      expectedOutput,
      error: null,
    };
  } catch (error) {
    return {
      name: testCase.name,
      passed: false,
      actualOutput: logs.join("\n"),
      expectedOutput: String(testCase.expectedOutput ?? ""),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

self.onmessage = async (event) => {
  const { code, testCases } = event.data ?? {};

  if (typeof code !== "string" || !Array.isArray(testCases)) {
    self.postMessage({
      type: "error",
      error: "Invalid payload. Expected { code, testCases }.",
    });
    return;
  }

  const results = [];

  for (const testCase of testCases) {
    const result = await runTest(code, testCase, DEFAULT_TIMEOUT_MS);
    results.push(result);
  }

  self.postMessage({ type: "results", results });
};
