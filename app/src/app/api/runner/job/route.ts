import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp } from "@/lib/api/middleware";
import { enforceRunnerRateLimit, runRunnerJob, runnerJobSchema } from "@/lib/runner";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { redactRunnerLogs } from "@/lib/runner/redaction";
import {
  createWorkspaceArchiveBase64,
  extractOutputArchiveBase64,
  submitRemoteJob,
  waitForRemoteJobResult,
} from "@/lib/runner/remote";

const proxyRequestSchema = runnerJobSchema.extend({
  stream: z.boolean().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const actorId = await resolveRequestActorId(request);
    const rate = await enforceRunnerRateLimit(`runner-job:${actorId}:${ip}`);

    const body = proxyRequestSchema.parse((await request.json()) as unknown);
    const stream = body.stream === true;
    const scopedBody = {
      ...body,
      userId: actorId,
    };

    const runnerUrl = process.env.RUNNER_URL;
    const sharedSecret = process.env.RUNNER_SHARED_SECRET ?? "";

    if (runnerUrl) {
      const workspaceTarGzBase64 = await createWorkspaceArchiveBase64(scopedBody.files);
      const workspaceId = `${body.courseId}:${actorId}`;
      const submitted = await submitRemoteJob(runnerUrl, sharedSecret, {
        jobType: scopedBody.jobType,
        workspaceId,
        workspaceTarGzBase64,
        args: scopedBody.args,
        env: {},
        clientMeta: { ip },
      });

      if (stream) {
        return NextResponse.json(
          { jobId: submitted.jobId },
          {
            headers: {
              "X-RateLimit-Limit": String(rate.limit),
              "X-RateLimit-Remaining": String(rate.remaining),
              "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
            },
          }
        );
      }

      const final = await waitForRemoteJobResult(runnerUrl, submitted.jobId);
      const outputFiles =
        final.result?.outputFilesTarGzBase64
          ? await extractOutputArchiveBase64(final.result.outputFilesTarGzBase64)
          : undefined;

      return NextResponse.json(
        {
          result: {
            jobType: scopedBody.jobType,
            exitCode: final.result?.exitCode ?? 1,
            stdout: final.result?.stdoutTail ?? "",
            stderr: final.result?.stderrTail ?? "",
            artifacts: {
              buildSucceeded: final.result?.exitCode === 0,
            },
            outputFiles,
            durationMs: final.result?.artifactsMeta.durationMs ?? 0,
          },
        },
        {
          headers: {
            "X-RateLimit-Limit": String(rate.limit),
            "X-RateLimit-Remaining": String(rate.remaining),
            "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
          },
        }
      );
    }

    const result = await runRunnerJob(scopedBody);
    return NextResponse.json(
      { result },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    const message = redactRunnerLogs(error instanceof Error ? error.message : "Runner job failed");
    const status = /rate limit/i.test(message)
      ? 429
      : /validation|policy|invalid|unsupported|only devnet|forbidden/i.test(message.toLowerCase())
      ? 400
      : 500;
    const retryAfterMatch = /retry after (\d+)s/i.exec(message);
    const headers = retryAfterMatch ? { "Retry-After": retryAfterMatch[1] } : undefined;
    return NextResponse.json({ error: message }, { status, headers });
  }
}
