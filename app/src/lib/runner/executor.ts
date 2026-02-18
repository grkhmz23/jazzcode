import { spawn } from "node:child_process";

export type CommandExecution = {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

export async function executeCommandWithLimits(input: {
  cwd: string;
  command: string;
  args: string[];
  timeoutMs: number;
  maxOutputBytes: number;
  env?: Record<string, string>;
}): Promise<CommandExecution> {
  return new Promise((resolve) => {
    const child = spawn(input.command, input.args, {
      cwd: input.cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        PATH: process.env.PATH ?? "",
        HOME: "/tmp",
        NODE_ENV: "production",
        ...(input.env ?? {}),
      },
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, input.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      if (stdout.length < input.maxOutputBytes) {
        stdout += chunk.toString("utf8");
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      if (stderr.length < input.maxOutputBytes) {
        stderr += chunk.toString("utf8");
      }
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({
        exitCode: 127,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        timedOut,
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
        timedOut,
      });
    });
  });
}
