import { redactRunnerLogs } from "@/lib/runner/redaction";
import { validateRunnerRequestPolicy } from "@/lib/runner/policy";
import { executeRunnerJob } from "@/lib/runner/jobs";
import { RunnerJobRequest, RunnerResult, runnerJobSchema } from "@/lib/runner/types";

export async function runRunnerJob(input: unknown): Promise<RunnerResult> {
  const request = runnerJobSchema.parse(input) as RunnerJobRequest;
  validateRunnerRequestPolicy(request);

  const result = await executeRunnerJob(request);
  return {
    ...result,
    stdout: redactRunnerLogs(result.stdout),
    stderr: redactRunnerLogs(result.stderr),
  };
}
