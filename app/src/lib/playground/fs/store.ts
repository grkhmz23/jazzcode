/**
 * Virtual File System Store
 * IndexedDB-backed storage with deterministic serialization
 */

import type { FileEntry, FsSnapshot, FsChange, FsChangeListener } from "./types";

const DB_NAME = "playground-fs-v1";
const DB_VERSION = 1;
const STORE_NAME = "files";
const META_STORE = "meta";

class FsStore {
  private db: IDBDatabase | null = null;
  private listeners: FsChangeListener[] = [];
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private doInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB not available"));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "path" });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Failed to open IndexedDB"));
      };
    });
  }

  onChange(listener: FsChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(change: FsChange): void {
    for (const listener of this.listeners) {
      try {
        listener(change);
      } catch {
        // Ignore listener errors
      }
    }
  }

  async readFile(path: string): Promise<FileEntry | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(path);

      request.onsuccess = () => {
        resolve((request.result as FileEntry) ?? null);
      };

      request.onerror = () => {
        reject(request.error ?? new Error(`Failed to read file: ${path}`));
      };
    });
  }

  async writeFile(
    path: string,
    content: string,
    language?: string,
    readOnly?: boolean
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const existing = await this.readFile(path);
    const entry: FileEntry = {
      type: "file",
      path,
      name: path.split("/").pop() ?? path,
      content,
      language: (language as FileEntry["language"]) ?? this.inferLanguage(path),
      updatedAt: Date.now(),
      readOnly: readOnly ?? existing?.readOnly ?? false,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(entry);

      request.onsuccess = () => {
        this.notify({
          type: existing ? "update" : "create",
          path,
          timestamp: entry.updatedAt,
        });
        resolve();
      };

      request.onerror = () => {
        reject(request.error ?? new Error(`Failed to write file: ${path}`));
      };
    });
  }

  async deleteFile(path: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(path);

      request.onsuccess = () => {
        this.notify({
          type: "delete",
          path,
          timestamp: Date.now(),
        });
        resolve();
      };

      request.onerror = () => {
        reject(request.error ?? new Error(`Failed to delete file: ${path}`));
      };
    });
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    const existing = await this.readFile(oldPath);
    if (!existing) {
      throw new Error(`File not found: ${oldPath}`);
    }

    const entry: FileEntry = {
      ...existing,
      path: newPath,
      name: newPath.split("/").pop() ?? newPath,
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Delete old entry
      const deleteRequest = store.delete(oldPath);
      deleteRequest.onerror = () => {
        reject(deleteRequest.error ?? new Error(`Failed to rename file: ${oldPath}`));
      };

      // Create new entry
      const putRequest = store.put(entry);
      putRequest.onerror = () => {
        reject(putRequest.error ?? new Error(`Failed to create file: ${newPath}`));
      };

      transaction.oncomplete = () => {
        this.notify({
          type: "rename",
          path: newPath,
          previousPath: oldPath,
          timestamp: entry.updatedAt,
        });
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error ?? new Error("Transaction failed"));
      };
    });
  }

  async listFiles(): Promise<FileEntry[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = (request.result as FileEntry[]).sort((a, b) =>
          a.path.localeCompare(b.path)
        );
        resolve(entries);
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Failed to list files"));
      };
    });
  }

  async exportSnapshot(): Promise<FsSnapshot> {
    const entries = await this.listFiles();
    const entryMap: Record<string, FileEntry> = {};
    for (const entry of entries) {
      entryMap[entry.path] = entry;
    }

    return {
      version: 1,
      entries: entryMap,
      timestamp: Date.now(),
    };
  }

  async importSnapshot(snapshot: FsSnapshot): Promise<void> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");

    // Clear existing files
    const existing = await this.listFiles();
    for (const entry of existing) {
      await this.deleteFile(entry.path);
    }

    // Import snapshot files
    for (const entry of Object.values(snapshot.entries)) {
      await this.writeFile(entry.path, entry.content, entry.language, entry.readOnly);
    }
  }

  async clear(): Promise<void> {
    await this.init();
    if (!this.db) return;

    const entries = await this.listFiles();
    for (const entry of entries) {
      await this.deleteFile(entry.path);
    }
  }

  private inferLanguage(path: string): FileEntry["language"] {
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, FileEntry["language"]> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      rs: "rust",
      md: "markdown",
      txt: "plaintext",
    };
    return map[ext] ?? "plaintext";
  }
}

export const fsStore = new FsStore();
