/**
 * Playground Share Store
 * File-system based storage for playground bundles
 */

import { promises as fs } from "fs";
import { join, resolve } from "path";
import { randomBytes } from "crypto";
import type { ValidatedComponentBundle } from "@/lib/component-hub/schema";

// Get data directory dynamically (allows testing with different paths)
function getDataDir(): string {
  return process.env.PLAYGROUND_SHARE_DIR 
    ? resolve(process.env.PLAYGROUND_SHARE_DIR)
    : resolve(".data/playground-shares");
}
const SHARE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_SHARES = 1000;

export interface ShareRecord {
  id: string;
  bundle: ValidatedComponentBundle;
  createdAt: string;
  expiresAt: string;
}

/**
 * Generate a short, URL-safe share ID
 */
function generateShareId(): string {
  // 12 bytes = 16 base64url chars
  return randomBytes(12).toString("base64url");
}

/**
 * Get the file path for a share
 */
function getSharePath(id: string): string {
  // Sanitize ID to prevent path traversal
  const sanitized = id.replace(/[^a-zA-Z0-9_\-]/g, "");
  return join(getDataDir(), `${sanitized}.json`);
}

/**
 * Store a bundle and return share ID
 */
export async function storeBundle(
  bundle: ValidatedComponentBundle
): Promise<{ id: string; expiresAt: Date }> {
  await fs.mkdir(getDataDir(), { recursive: true });

  // Cleanup old shares if at limit
  await cleanupIfNeeded();

  const id = generateShareId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SHARE_TTL_MS);

  const record: ShareRecord = {
    id,
    bundle,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await fs.writeFile(getSharePath(id), JSON.stringify(record, null, 2), "utf-8");

  return { id, expiresAt };
}

/**
 * Retrieve a bundle by share ID
 */
export async function retrieveBundle(
  id: string
): Promise<{ bundle: ValidatedComponentBundle; expiresAt: Date } | null> {
  try {
    const path = getSharePath(id);
    const content = await fs.readFile(path, "utf-8");
    const record = JSON.parse(content) as ShareRecord;

    // Check expiration
    const expiresAt = new Date(record.expiresAt);
    if (expiresAt < new Date()) {
      // Auto-delete expired
      await fs.unlink(path).catch(() => {});
      return null;
    }

    return { bundle: record.bundle, expiresAt };
  } catch {
    return null;
  }
}

/**
 * Delete a share by ID
 */
export async function deleteShare(id: string): Promise<boolean> {
  try {
    await fs.unlink(getSharePath(id));
    return true;
  } catch {
    return false;
  }
}

/**
 * Cleanup expired shares and enforce max limit
 */
export async function cleanupIfNeeded(): Promise<void> {
  try {
    const dataDir = getDataDir();
    const files = await fs.readdir(dataDir);
    const shareFiles = files.filter((f) => f.endsWith(".json"));

    if (shareFiles.length < MAX_SHARES) {
      // Just cleanup expired ones
      await cleanupExpired();
      return;
    }

    // Need to remove oldest shares
    const shares: { file: string; createdAt: Date }[] = [];

    for (const file of shareFiles) {
      try {
        const content = await fs.readFile(join(dataDir, file), "utf-8");
        const record = JSON.parse(content) as ShareRecord;
        shares.push({ file, createdAt: new Date(record.createdAt) });
      } catch {
        // Invalid file, delete it
        await fs.unlink(join(dataDir, file)).catch(() => {});
      }
    }

    // Sort by creation date, oldest first
    shares.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Remove oldest until we're under the limit
    const toRemove = shares.slice(0, shares.length - MAX_SHARES + 100); // +100 buffer
    for (const { file } of toRemove) {
      await fs.unlink(join(dataDir, file)).catch(() => {});
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Cleanup only expired shares
 */
export async function cleanupExpired(): Promise<number> {
  let cleaned = 0;
  try {
    const dataDir = getDataDir();
    const files = await fs.readdir(dataDir);
    const now = new Date();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      try {
        const content = await fs.readFile(join(dataDir, file), "utf-8");
        const record = JSON.parse(content) as ShareRecord;
        const expiresAt = new Date(record.expiresAt);

        if (expiresAt < now) {
          await fs.unlink(join(dataDir, file));
          cleaned++;
        }
      } catch {
        // Invalid file, delete it
        await fs.unlink(join(dataDir, file)).catch(() => {});
        cleaned++;
      }
    }
  } catch {
    // Ignore cleanup errors
  }
  return cleaned;
}
