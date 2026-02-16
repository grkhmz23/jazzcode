/**
 * Challenge Worker - Sandboxed code execution environment
 * Runs in a Web Worker context, isolated from the main thread
 */

// Block dangerous globals to create a sandbox
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.importScripts = undefined;
self.WebSocket = undefined;
self.localStorage = undefined;
self.sessionStorage = undefined;
self.indexedDB = undefined;
self.openDatabase = undefined;

// Block timers that could be used for attacks
self.setInterval = undefined;
self.clearInterval = undefined;

// Block other potentially dangerous APIs
self.navigator = undefined;
self.location = undefined;
self.document = undefined;
self.window = undefined;
self.parent = undefined;
self.top = undefined;
self.self = self;

/**
 * Execute a single test case
 */
function runTestCase(code, testCase) {
  const startTime = Date.now();
  const logs = [];

  try {
    // Create mock console for capturing output
    const mockConsole = {
      log: (...args) => logs.push(args.map((a) => String(a)).join(" ")),
      error: (...args) =>
        logs.push("[ERROR] " + args.map((a) => String(a)).join(" ")),
      warn: (...args) =>
        logs.push("[WARN] " + args.map((a) => String(a)).join(" ")),
      info: (...args) =>
        logs.push("[INFO] " + args.map((a) => String(a)).join(" ")),
    };

    // Parse input - it comes as a JSON string
    let parsedInput;
    try {
      parsedInput = JSON.parse(testCase.input);
    } catch {
      // If parsing fails, use the raw input string
      parsedInput = testCase.input;
    }

    // Create the user function
    // The code should define a function that we can call
    const wrappedCode = `
      ${code}
      
      // Try to detect the main function
      // If the user defined a function, we call it with the input
      // Otherwise, we assume the code produces a return value
    `;

    // Create a function from the code
    const userFn = new Function("console", "input", wrappedCode + "\n//# sourceURL=user-code.js");

    // Execute the function
    const result = userFn(mockConsole, parsedInput);

    // Determine the actual output
    let actualOutput;
    if (result !== undefined) {
      actualOutput = String(result);
    } else if (logs.length > 0) {
      actualOutput = logs.join("\n");
    } else {
      actualOutput = "";
    }

    const passed = actualOutput.trim() === testCase.expectedOutput.trim();
    const executionTime = Date.now() - startTime;

    return {
      name: testCase.name,
      passed,
      actualOutput,
      expectedOutput: testCase.expectedOutput,
      logs,
      executionTime,
      error: null,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      name: testCase.name,
      passed: false,
      actualOutput: "",
      expectedOutput: testCase.expectedOutput,
      logs,
      executionTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handle messages from the main thread
 */
self.onmessage = function (e) {
  const { code, testCases, timeoutMs } = e.data;

  if (!code || !Array.isArray(testCases)) {
    self.postMessage({
      type: "error",
      error: "Invalid input: code and testCases are required",
    });
    return;
  }

  const results = [];

  for (const testCase of testCases) {
    // Check for timeout (simple check, not precise)
    if (Date.now() - e.timeStamp > (timeoutMs || 5000)) {
      results.push({
        name: testCase.name,
        passed: false,
        actualOutput: "",
        expectedOutput: testCase.expectedOutput,
        logs: [],
        executionTime: timeoutMs || 5000,
        error: "Execution timed out",
      });
      break;
    }

    const result = runTestCase(code, testCase);
    results.push(result);
  }

  self.postMessage({ type: "results", results });
};
