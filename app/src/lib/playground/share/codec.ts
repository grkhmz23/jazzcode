/**
 * Share URL codec for Playground V2
 * Encodes workspace + terminal session seed for reproducible sharing
 */

import { Workspace } from "@/lib/playground/types";
import { checkShareLimits } from "@/lib/playground/security/limits";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export interface SharePayload {
  version: 2;
  /** Workspace file tree */
  workspace: {
    templateId: string;
    files: Record<string, { content: string; language?: string }>;
    openFiles: string[];
    activeFile: string;
  };
  /** Terminal session seed for deterministic outputs */
  terminalSeed?: string;
  /** Metadata */
  meta: {
    createdAt: number;
    title?: string;
    description?: string;
  };
}

export type ShareResult =
  | {
      success: true;
      url: string;
      payloadSize: number;
    }
  | {
      success: false;
      error: string;
      payloadSize: number;
    };

/** Convert payload to minimal format for URL */
function minimizePayload(payload: SharePayload): unknown {
  return {
    v: payload.version,
    w: {
      t: payload.workspace.templateId,
      f: Object.entries(payload.workspace.files).map(([path, f]) =>
        f.language ? [path, f.content, f.language] : [path, f.content]
      ),
      o: payload.workspace.openFiles,
      a: payload.workspace.activeFile,
    },
    s: payload.terminalSeed,
    m: {
      c: payload.meta.createdAt,
      t: payload.meta.title,
      d: payload.meta.description,
    },
  };
}

/** Restore payload from minimal format */
function restorePayload(minimal: unknown): SharePayload | null {
  try {
    const m = minimal as Record<string, unknown>;
    if (m.v !== 2) return null;

    const files: Record<string, { content: string; language?: string }> = {};
    const fileArray = (m.w as Record<string, unknown>).f as Array<[string, string] | [string, string, string]>;

    for (const entry of fileArray) {
      if (entry.length === 3) {
        files[entry[0]] = { content: entry[1], language: entry[2] };
      } else {
        files[entry[0]] = { content: entry[1] };
      }
    }

    return {
      version: 2,
      workspace: {
        templateId: ((m.w as Record<string, unknown>).t as string) ?? "shared",
        files,
        openFiles: ((m.w as Record<string, unknown>).o as string[]) ?? Object.keys(files).slice(0, 1),
        activeFile: ((m.w as Record<string, unknown>).a as string) ?? Object.keys(files)[0],
      },
      terminalSeed: (m.s as string) ?? undefined,
      meta: {
        createdAt: ((m.m as Record<string, unknown>).c as number) ?? Date.now(),
        title: ((m.m as Record<string, unknown>).t as string) ?? undefined,
        description: ((m.m as Record<string, unknown>).d as string) ?? undefined,
      },
    };
  } catch {
    return null;
  }
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === "undefined") {
    return bytes;
  }
  const stream = new Blob([toArrayBuffer(bytes)]).stream().pipeThrough(new CompressionStream("gzip"));
  const compressed = await new Response(stream).arrayBuffer();
  return new Uint8Array(compressed);
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    return bytes;
  }
  const stream = new Blob([toArrayBuffer(bytes)]).stream().pipeThrough(new DecompressionStream("gzip"));
  const decompressed = await new Response(stream).arrayBuffer();
  return new Uint8Array(decompressed);
}

/** Encode workspace to shareable URL fragment */
export async function encodeWorkspaceShare(
  workspace: Workspace,
  terminalSeed?: string,
  options?: {
    title?: string;
    description?: string;
  }
): Promise<ShareResult> {
  const payload: SharePayload = {
    version: 2,
    workspace: {
      templateId: workspace.templateId,
      files: Object.fromEntries(
        Object.entries(workspace.files).map(([path, file]) => [
          path,
          { content: file.content, language: file.language },
        ])
      ),
      openFiles: workspace.openFiles,
      activeFile: workspace.activeFile,
    },
    terminalSeed,
    meta: {
      createdAt: Date.now(),
      title: options?.title,
      description: options?.description,
    },
  };

  const minimal = minimizePayload(payload);
  const json = JSON.stringify(minimal);
  const rawBytes = textEncoder.encode(json);
  const compressed = await gzip(rawBytes);
  const marker = compressed.length < rawBytes.length ? "p2" : "u2";
  const bytes = marker === "p2" ? compressed : rawBytes;
  const encoded = `${marker}.${toBase64Url(bytes)}`;

  const payloadSize = encoded.length;

  const limitCheck = checkShareLimits(payloadSize);
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: limitCheck.reason,
      payloadSize,
    };
  }

  return {
    success: true,
    url: `#share=${encoded}`,
    payloadSize,
  };
}

/** Decode workspace from shareable URL fragment */
export async function decodeWorkspaceShare(
  hashFragment: string
): Promise<{ workspace: Workspace; terminalSeed?: string } | null> {
  const match = hashFragment.match(/[#&]?share=([^&]+)/);
  if (!match) return null;

  const encoded = match[1];
  const [marker, payload] = encoded.split(".", 2);
  if (!marker || !payload || (marker !== "p2" && marker !== "u2")) {
    return null;
  }

  const bytes = fromBase64Url(payload);
  if (!bytes) return null;

  try {
    const decodedBytes = marker === "p2" ? await gunzip(bytes) : bytes;
    const parsed = JSON.parse(textDecoder.decode(decodedBytes)) as unknown;
    const payload = restorePayload(parsed);
    if (!payload) return null;

    const now = Date.now();
    const workspace: Workspace = {
      templateId: payload.workspace.templateId,
      files: Object.fromEntries(
        Object.entries(payload.workspace.files).map(([path, file]) => [
          path,
          {
            path,
            content: file.content,
            language: (file.language as Workspace["files"][string]["language"]) ?? "typescript",
            updatedAt: now,
            readOnly: false,
          },
        ])
      ),
      openFiles: payload.workspace.openFiles,
      activeFile: payload.workspace.activeFile,
      createdAt: now,
      updatedAt: now,
    };

    return {
      workspace,
      terminalSeed: payload.terminalSeed,
    };
  } catch {
    return null;
  }
}

/** Get shareable link for current workspace */
export async function getShareableLink(
  workspace: Workspace,
  terminalSeed?: string,
  baseUrl?: string
): Promise<ShareResult> {
  const result = await encodeWorkspaceShare(workspace, terminalSeed, {
    title: "Shared Playground",
    description: `Shared workspace with ${Object.keys(workspace.files).length} files`,
  });

  if (!result.success) return result;

  const url = baseUrl ?? (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "");

  return {
    success: true,
    url: `${url}${result.url}`,
    payloadSize: result.payloadSize,
  };
}
