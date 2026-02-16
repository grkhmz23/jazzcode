export interface RunnerTestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface RunnerResult {
  success: boolean;
  testResults: Array<{
    testId: string;
    testName: string;
    passed: boolean;
    actual: string;
    expected: string;
    error: string | null;
  }>;
  output: string;
  error: string | null;
  executionTimeMs: number;
}

const WORKER_CODE = `
self.onmessage = function(e) {
  const { code, testCases, timeoutMs } = e.data;
  const results = [];
  const logs = [];
  
  // Capture console.log output
  const originalLog = console.log;
  console.log = function(...args) {
    logs.push(args.join(' '));
  };
  
  const startTime = Date.now();
  
  try {
    // Create function from code
    const fn = new Function('return ' + code)();
    
    for (const tc of testCases) {
      try {
        const input = JSON.parse(tc.input);
        const result = fn(...input);
        const actual = typeof result === 'object' ? JSON.stringify(result) : String(result);
        const passed = actual.trim() === tc.expectedOutput.trim();
        
        results.push({
          testId: tc.id,
          testName: tc.name,
          passed,
          actual,
          expected: tc.expectedOutput,
          error: null
        });
      } catch (err) {
        results.push({
          testId: tc.id,
          testName: tc.name,
          passed: false,
          actual: '',
          expected: tc.expectedOutput,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    
    const executionTimeMs = Date.now() - startTime;
    
    self.postMessage({
      success: results.every(r => r.passed),
      testResults: results,
      output: logs.join('\\n'),
      error: null,
      executionTimeMs
    });
  } catch (err) {
    self.postMessage({
      success: false,
      testResults: results,
      output: logs.join('\\n'),
      error: err instanceof Error ? err.message : String(err),
      executionTimeMs: Date.now() - startTime
    });
  }
};
`;

export async function runChallenge(
  code: string,
  testCases: RunnerTestCase[],
  timeoutMs: number = 5000
): Promise<RunnerResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    // In a browser environment, use Web Worker
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      
      const timeoutId = setTimeout(() => {
        worker.terminate();
        resolve({
          success: false,
          testResults: testCases.map(tc => ({
            testId: tc.id,
            testName: tc.name,
            passed: false,
            actual: '',
            expected: tc.expectedOutput,
            error: `Execution timed out (${timeoutMs / 1000}s limit)`,
          })),
          output: '',
          error: `Execution timed out (${timeoutMs / 1000}s limit)`,
          executionTimeMs: timeoutMs,
        });
      }, timeoutMs);
      
      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        worker.terminate();
        resolve({
          ...e.data,
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      };
      
      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        worker.terminate();
        resolve({
          success: false,
          testResults: testCases.map(tc => ({
            testId: tc.id,
            testName: tc.name,
            passed: false,
            actual: '',
            expected: tc.expectedOutput,
            error: err.message,
          })),
          output: '',
          error: err.message,
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      };
      
      worker.postMessage({ code, testCases, timeoutMs });
    } else {
      // Server-side fallback - return a mock result
      resolve({
        success: false,
        testResults: testCases.map(tc => ({
          testId: tc.id,
          testName: tc.name,
          passed: false,
          actual: '',
          expected: tc.expectedOutput,
          error: 'Challenge runner only available in browser',
        })),
        output: '',
        error: 'Challenge runner only available in browser',
        executionTimeMs: 0,
      });
    }
  });
}
