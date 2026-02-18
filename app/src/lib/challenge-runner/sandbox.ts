import { Worker } from "node:worker_threads";
import ts from "typescript";

export interface SandboxTestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

export interface SandboxTestResult {
  name: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  logs: string[];
  executionTime: number;
  error: string | null;
}

export interface SandboxRunResult {
  testResults: SandboxTestResult[];
  allPassed: boolean;
  totalTime: number;
  error: string | null;
}

const BLOCKED_CODE_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /\beval\s*\(/i, message: "eval() is not allowed" },
  { pattern: /\bFunction\s*\(/i, message: "Function constructor is not allowed" },
  { pattern: /\bfetch\s*\(/i, message: "fetch() is not allowed" },
  { pattern: /\bXMLHttpRequest\b/i, message: "XMLHttpRequest is not allowed" },
  { pattern: /\bimportScripts\s*\(/i, message: "importScripts is not allowed" },
  { pattern: /\bWebSocket\s*\(/i, message: "WebSocket is not allowed" },
  { pattern: /\.\s*constructor\s*\(/i, message: "Constructor escape pattern is not allowed" },
  { pattern: /\[\s*["']constructor["']\s*\]\s*\(/i, message: "Constructor escape pattern is not allowed" },
];

const ISOLATED_WORKER_SOURCE = `
const vm = require("node:vm");
const { parentPort } = require("node:worker_threads");

function toOutput(value, logs) {
  if (value === undefined) return logs.join("\\n");
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function createContext(logs, deterministicNow) {
  const safeConsole = {
    log: (...args) => logs.push(args.map((arg) => String(arg)).join(" ")),
    error: (...args) => logs.push("[ERROR] " + args.map((arg) => String(arg)).join(" ")),
    warn: (...args) => logs.push("[WARN] " + args.map((arg) => String(arg)).join(" ")),
    info: (...args) => logs.push("[INFO] " + args.map((arg) => String(arg)).join(" ")),
  };

  const safeMath = Object.create(Math);
  safeMath.random = () => 0.123456789;

  class SafeDate extends Date {
    static now() {
      return deterministicNow;
    }
  }

  const sandbox = {
    console: safeConsole,
    Math: safeMath,
    Date: SafeDate,
    fetch: undefined,
    XMLHttpRequest: undefined,
    importScripts: undefined,
    WebSocket: undefined,
    Function: undefined,
    eval: undefined,
  };
  sandbox.globalThis = sandbox;
  return vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
}

function buildExecutionSource(transpiledCode) {
  return \`
"use strict";
const exports = {};
const module = { exports };
\${transpiledCode}
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
  throw new Error("Runner misconfigured: entry function run(input) not found.");
}
__challengeFn;
\`;
}

parentPort.on("message", async (payload) => {
  const logs = [];
  try {
    const timeoutMs = payload.timeoutMs;
    const context = createContext(logs, 1700000000000);
    const loadScript = new vm.Script(buildExecutionSource(payload.transpiledCode), { filename: "challenge-user-code.js" });
    const fn = loadScript.runInContext(context, { timeout: timeoutMs });
    if (typeof fn !== "function") {
      throw new Error("Runner misconfigured: callable challenge function was not found.");
    }
    context.__challengeInput = payload.input;
    context.__challengeFn = fn;
    const invokeScript = new vm.Script(
      "Array.isArray(__challengeInput) ? __challengeFn(...__challengeInput) : __challengeFn(__challengeInput)"
    );
    const value = invokeScript.runInContext(context, { timeout: timeoutMs });
    parentPort.postMessage({
      ok: true,
      actualOutput: toOutput(value, logs),
      logs,
    });
  } catch (error) {
    parentPort.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      logs,
    });
  }
});
`;

function validateSandboxCode(code: string): { valid: true } | { valid: false; error: string } {
  for (const entry of BLOCKED_CODE_PATTERNS) {
    if (entry.pattern.test(code)) {
      return { valid: false, error: entry.message };
    }
  }
  return { valid: true };
}

function parseInput(rawInput: string): unknown {
  try {
    return JSON.parse(rawInput);
  } catch {
    return rawInput;
  }
}

function transpileUserCode(code: string): string {
  return ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      sourceMap: false,
      inlineSourceMap: false,
      removeComments: true,
    },
    reportDiagnostics: false,
  }).outputText;
}

type WorkerExecutionResult = {
  ok: boolean;
  actualOutput?: string;
  logs: string[];
  error?: string;
};

async function runInIsolatedWorker(
  transpiledCode: string,
  input: unknown,
  timeoutMs: number
): Promise<WorkerExecutionResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(ISOLATED_WORKER_SOURCE, {
      eval: true,
      resourceLimits: {
        maxOldGenerationSizeMb: 32,
        maxYoungGenerationSizeMb: 16,
        stackSizeMb: 4,
      },
    });

    const timeout = setTimeout(() => {
      void worker.terminate();
      reject(new Error(`Execution timed out (${timeoutMs / 1000}s limit)`));
    }, timeoutMs);

    worker.on("message", (message: WorkerExecutionResult) => {
      clearTimeout(timeout);
      void worker.terminate();
      resolve(message);
    });

    worker.on("error", (error: Error) => {
      clearTimeout(timeout);
      void worker.terminate();
      reject(error);
    });

    worker.postMessage({ transpiledCode, input, timeoutMs });
  });
}

async function executeTestInSandbox(
  transpiledCode: string,
  testCase: SandboxTestCase,
  timeoutMs: number
): Promise<SandboxTestResult> {
  const start = Date.now();
  const expectedOutput = String(testCase.expectedOutput ?? "");
  try {
    const input = parseInput(testCase.input);
    const execution = await runInIsolatedWorker(transpiledCode, input, timeoutMs);
    if (!execution.ok) {
      throw new Error(execution.error ?? "Sandbox execution failed");
    }
    const actualOutput = execution.actualOutput ?? "";
    return {
      name: testCase.name,
      passed: actualOutput.trim() === expectedOutput.trim(),
      actualOutput,
      expectedOutput,
      logs: execution.logs,
      executionTime: Date.now() - start,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      name: testCase.name,
      passed: false,
      actualOutput: `Error: ${message}`,
      expectedOutput,
      logs: [],
      executionTime: Date.now() - start,
      error: message,
    };
  }
}

export async function runChallengeInSandbox(
  code: string,
  testCases: SandboxTestCase[],
  timeoutMs: number
): Promise<SandboxRunResult> {
  const startedAt = Date.now();
  const validation = validateSandboxCode(code);
  if (!validation.valid) {
    return {
      testResults: testCases.map((testCase) => ({
        name: testCase.name,
        passed: false,
        actualOutput: "",
        expectedOutput: testCase.expectedOutput,
        logs: [],
        executionTime: 0,
        error: validation.error,
      })),
      allPassed: false,
      totalTime: Date.now() - startedAt,
      error: validation.error,
    };
  }

  const transpiledCode = transpileUserCode(code);
  const testResults: SandboxTestResult[] = [];
  for (const testCase of testCases) {
    testResults.push(await executeTestInSandbox(transpiledCode, testCase, timeoutMs));
  }

  return {
    testResults,
    allPassed: testResults.every((item) => item.passed),
    totalTime: Date.now() - startedAt,
    error: null,
  };
}
