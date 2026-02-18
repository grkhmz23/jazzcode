/* eslint-disable no-restricted-globals */

// Sandboxed execution: block network and dynamic imports.
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;

const DEFAULT_TIMEOUT_MS = 5000;
const FIXED_REFERENCE_NOW_MS = 1700000000000;

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

function sanitizeModuleSyntax(code) {
  return code
    .replace(/\bexport\s+default\s+/g, "")
    .replace(/\bexport\s+/g, "");
}

function deterministicNowMsForInput(input) {
  if (!input || typeof input !== "object") {
    return 1234567890;
  }

  // Keep "current time" deterministic but independent from user input so
  // stale timestamp checks can still fail predictably in challenge tests.
  if ("timestamp" in input) {
    return FIXED_REFERENCE_NOW_MS;
  }

  return 1234567890;
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
    const safeCode = sanitizeModuleSyntax(code);
    const deterministicNow = deterministicNowMsForInput(input);
    const deterministicRandom = Number.parseInt("abc123", 36) / Math.pow(36, 6);

    const execute = new Function(
      "console",
      "input",
      "__deterministicNow",
      "__deterministicRandom",
      `const exports = {};
const module = { exports };
const __previousDateNow = Date.now;
const __previousRandom = Math.random;
Date.now = () => __deterministicNow;
Math.random = () => __deterministicRandom;
try {
${safeCode}
const __namedExportFns =
  module.exports && typeof module.exports === "object"
    ? Object.entries(module.exports).filter((entry) => typeof entry[1] === "function")
    : [];
const __challengeFn =
  typeof run === "function"
    ? run
    : typeof main === "function"
      ? main
      : typeof module.exports === "function"
        ? module.exports
        : typeof module.exports.run === "function"
          ? module.exports.run
          : typeof module.exports.default === "function"
            ? module.exports.default
            : typeof exports.run === "function"
              ? exports.run
              : typeof exports.default === "function"
                ? exports.default
                : __namedExportFns.length === 1
                  ? __namedExportFns[0][1]
                  : null;
if (typeof __challengeFn !== "function") {
  const __exportNames = __namedExportFns.map((entry) => entry[0]).join(", ");
  throw new Error(
    __exportNames.length > 0
      ? "Runner misconfigured: no callable entrypoint found. Available exports: " + __exportNames
      : "Runner misconfigured: entry function run(input) not found."
  );
}
const __result = Array.isArray(input) ? __challengeFn(...input) : __challengeFn(input);
return __result;
} finally {
  Date.now = __previousDateNow;
  Math.random = __previousRandom;
}
//# sourceURL=challenge-user-code.js`
    );

    const value = await runWithTimeout(
      () => execute(mockConsole, input, deterministicNow, deterministicRandom),
      timeoutMs
    );
    const actualOutput = (() => {
      if (value === undefined) {
        return logs.join("\n");
      }
      if (typeof value === "string") {
        return value;
      }
      if (value && typeof value === "object") {
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      }
      return String(value);
    })();
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
