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

function toErrorString(error) {
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}

function stripTypeAnnotations(code) {
  return code
    .replace(/\bexport\s+/g, "")
    .replace(/interface\s+\w+\s*{[\s\S]*?}\s*/g, "")
    .replace(/type\s+\w+\s*=\s*[\s\S]*?;\s*/g, "")
    .replace(/(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*[^=;]+/g, "$1 $2")
    .replace(/([,(]\s*[A-Za-z_$][\w$]*)\s*:\s*[^,)\n]+/g, "$1")
    .replace(/\)\s*:\s*[^({=>\n]+/g, ")")
    .replace(/\s+as\s+[A-Za-z_$][\w$<>\[\]\|&, ]*/g, "");
}

function findFunctionName(source) {
  const match = source.match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/);
  return match ? match[1] : null;
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
  const testStartTime = Date.now();

  try {
    const input = parseInput(testCase.input);
    const transpiledCode = stripTypeAnnotations(code);
    const functionName = findFunctionName(transpiledCode);
    const functionResolver = functionName
      ? `typeof ${functionName} === "function" ? ${functionName} : null`
      : "null";

    const execute = new Function(
      "console",
      "input",
      `${transpiledCode}
const __challengeFn = ${functionResolver};
if (typeof __challengeFn === "function") {
  return Array.isArray(input) ? __challengeFn(...input) : __challengeFn(input);
}
return undefined;
//# sourceURL=challenge-user-code.js`
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
      logs,
      executionTime: Date.now() - testStartTime,
      error: null,
    };
  } catch (error) {
    const actualOutput = toErrorString(error);
    const expectedOutput = String(testCase.expectedOutput ?? "");

    return {
      name: testCase.name,
      passed: actualOutput.trim() === expectedOutput.trim(),
      actualOutput,
      expectedOutput,
      logs,
      executionTime: Date.now() - testStartTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

self.onmessage = async (event) => {
  const { code, testCases, timeoutMs } = event.data ?? {};
  const perTestTimeoutMs =
    typeof timeoutMs === "number" && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;

  if (typeof code !== "string" || !Array.isArray(testCases)) {
    self.postMessage({
      type: "error",
      error: "Invalid payload. Expected { code, testCases }.",
    });
    return;
  }

  const results = [];

  for (const testCase of testCases) {
    const result = await runTest(code, testCase, perTestTimeoutMs);
    results.push(result);
  }

  self.postMessage({ type: "results", results });
};
