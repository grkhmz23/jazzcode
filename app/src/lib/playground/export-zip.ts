import { Workspace } from "@/lib/playground/types";

const MAX_EXPORT_BYTES = 5_000_000;

function encodeUtf8(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function crc32(bytes: Uint8Array): number {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ -1) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

interface ZipEntry {
  path: string;
  nameBytes: Uint8Array;
  contentBytes: Uint8Array;
  crc: number;
  localHeaderOffset: number;
}

export function buildWorkspaceZip(workspace: Workspace): Blob {
  const entries: ZipEntry[] = Object.values(workspace.files)
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((file) => {
      const normalizedPath = file.path.replace(/^\//, "");
      const nameBytes = encodeUtf8(normalizedPath);
      const contentBytes = encodeUtf8(file.content);
      return {
        path: normalizedPath,
        nameBytes,
        contentBytes,
        crc: crc32(contentBytes),
        localHeaderOffset: 0,
      };
    });

  const totalBytesEstimate = entries.reduce((sum, entry) => sum + entry.contentBytes.length, 0);
  if (totalBytesEstimate > MAX_EXPORT_BYTES) {
    throw new Error("Workspace too large to export (limit: 5 MB). Remove files and try again.");
  }

  const buffers: Uint8Array[] = [];
  let offset = 0;

  entries.forEach((entry) => {
    entry.localHeaderOffset = offset;
    const localHeader = new Uint8Array(30 + entry.nameBytes.length);
    const localView = new DataView(localHeader.buffer);

    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, 0);
    writeUint16(localView, 12, 0);
    writeUint32(localView, 14, entry.crc);
    writeUint32(localView, 18, entry.contentBytes.length);
    writeUint32(localView, 22, entry.contentBytes.length);
    writeUint16(localView, 26, entry.nameBytes.length);
    writeUint16(localView, 28, 0);
    localHeader.set(entry.nameBytes, 30);

    buffers.push(localHeader, entry.contentBytes);
    offset += localHeader.length + entry.contentBytes.length;
  });

  const centralStart = offset;

  entries.forEach((entry) => {
    const centralHeader = new Uint8Array(46 + entry.nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);

    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, 0);
    writeUint16(centralView, 14, 0);
    writeUint32(centralView, 16, entry.crc);
    writeUint32(centralView, 20, entry.contentBytes.length);
    writeUint32(centralView, 24, entry.contentBytes.length);
    writeUint16(centralView, 28, entry.nameBytes.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, entry.localHeaderOffset);
    centralHeader.set(entry.nameBytes, 46);

    buffers.push(centralHeader);
    offset += centralHeader.length;
  });

  const centralSize = offset - centralStart;
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);

  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralSize);
  writeUint32(endView, 16, centralStart);
  writeUint16(endView, 20, 0);

  buffers.push(endRecord);
  const blobParts = buffers.map((buffer) => toArrayBuffer(buffer));
  return new Blob(blobParts, { type: "application/zip" });
}

export function downloadWorkspaceZip(workspace: Workspace, filename = "playground-workspace.zip"): void {
  const blob = buildWorkspaceZip(workspace);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(path: string, content: string): void {
  const filename = path.split("/").pop() ?? path;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
