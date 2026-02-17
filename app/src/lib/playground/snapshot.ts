import { Workspace } from "@/lib/playground/types";
import { normalizePath } from "@/lib/playground/workspace";

interface SnapshotPayload {
  version: 1;
  workspace: Workspace;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
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

function isValidWorkspace(workspace: unknown): workspace is Workspace {
  if (!isRecord(workspace)) {
    return false;
  }

  if (typeof workspace.templateId !== "string" || typeof workspace.activeFile !== "string") {
    return false;
  }

  if (!Array.isArray(workspace.openFiles) || !isRecord(workspace.files)) {
    return false;
  }

  try {
    Object.entries(workspace.files).forEach(([key, value]) => {
      const normalized = normalizePath(key);
      if (!isRecord(value)) {
        throw new Error("invalid file");
      }
      if (value.path !== normalized || typeof value.content !== "string") {
        throw new Error("invalid file content");
      }
    });
  } catch {
    return false;
  }

  return true;
}

export async function serializeSnapshot(workspace: Workspace): Promise<string> {
  const payload: SnapshotPayload = {
    version: 1,
    workspace,
  };

  const json = JSON.stringify(payload);
  const rawBytes = textEncoder.encode(json);
  const compressed = await gzip(rawBytes);
  const marker = compressed.length < rawBytes.length ? "c1" : "u1";
  const bytes = marker === "c1" ? compressed : rawBytes;
  return `${marker}.${toBase64Url(bytes)}`;
}

export async function deserializeSnapshot(input: string): Promise<Workspace | null> {
  const [marker, payload] = input.split(".", 2);
  if (!marker || !payload) {
    return null;
  }

  try {
    const bytes = fromBase64Url(payload);
    const decodedBytes = marker === "c1" ? await gunzip(bytes) : bytes;
    const parsed = JSON.parse(textDecoder.decode(decodedBytes)) as unknown;
    if (!isRecord(parsed) || parsed.version !== 1 || !isValidWorkspace(parsed.workspace)) {
      return null;
    }
    return parsed.workspace;
  } catch {
    return null;
  }
}
