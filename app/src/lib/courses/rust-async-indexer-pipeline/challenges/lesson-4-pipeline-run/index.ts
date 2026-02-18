import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(runPipeline(input.tasks, input.concurrency));
}

function runPipeline(tasks, concurrency) {
  const queue = tasks.slice();
  const running = [];
  const completedOrder = [];
  let tick = 0;
  while (queue.length > 0 || running.length > 0) {
    while (running.length < concurrency && queue.length > 0) {
      const task = queue.shift();
      running.push({ id: task.id, remaining: task.durationTicks });
    }
    tick += 1;
    for (const r of running) r.remaining -= 1;
    for (let i = running.length - 1; i >= 0; i -= 1) {
      if (running[i].remaining === 0) {
        completedOrder.push(running[i].id);
        running.splice(i, 1);
      }
    }
  }
  return { totalTicks: tick, completedOrder };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints = [
  "Model bounded concurrency with a deterministic queue and tick loop.",
  "No real timers; simulate progression by decrementing remaining ticks.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "runs pipeline with bounded concurrency",
    input: JSON.stringify({ tasks: [{ id: "a", durationTicks: 2 }, { id: "b", durationTicks: 1 }], concurrency: 1 }),
    expectedOutput: '{"totalTicks":3,"completedOrder":["a","b"]}',
  },
];
