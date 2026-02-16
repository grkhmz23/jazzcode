import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";

export async function createIsolatedWorkdir(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "runner-job-"));

  await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const absolute = join(dir, path);
      await mkdir(dirname(absolute), { recursive: true });
      await writeFile(absolute, content, "utf8");
    })
  );

  return dir;
}

export async function cleanupWorkdir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}
