import { Workspace } from "@/lib/playground/types";

const DB_NAME = "playground-v2";
const DB_VERSION = 2;
const WORKSPACE_STORE = "workspace";
const META_STORE = "meta";
const PROGRESS_STORE = "progress";
const WORKSPACE_KEY = "current";
const BURNER_KEY = "burner-wallet";

interface WorkspaceRecord {
  id: string;
  workspace: Workspace;
  updatedAt: number;
}

interface MetaRecord<TValue> {
  id: string;
  value: TValue;
  updatedAt: number;
}

export interface BurnerWalletRecord {
  secretKey: number[];
  publicKey: string;
  createdAt: number;
}

export interface QuestProgressRecord {
  questId: string;
  speedrunBestMs: number | null;
  achievements: string[];
  completions: number;
  updatedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (!isBrowser()) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(WORKSPACE_STORE)) {
        db.createObjectStore(WORKSPACE_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: "questId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest
): Promise<T | null> {
  const db = await openDatabase();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);

    request.onsuccess = () => {
      resolve((request.result as T | undefined) ?? null);
    };
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
    transaction.oncomplete = () => db.close();
  });
}

export async function loadWorkspaceFromIndexedDb(): Promise<Workspace | null> {
  const result = await withStore<WorkspaceRecord>(WORKSPACE_STORE, "readonly", (store) =>
    store.get(WORKSPACE_KEY)
  );
  return result?.workspace ?? null;
}

export async function saveWorkspaceToIndexedDb(workspace: Workspace): Promise<void> {
  await withStore<void>(WORKSPACE_STORE, "readwrite", (store) =>
    store.put({
      id: WORKSPACE_KEY,
      workspace,
      updatedAt: Date.now(),
    } as WorkspaceRecord)
  );
}

export async function clearWorkspaceInIndexedDb(): Promise<void> {
  await withStore<void>(WORKSPACE_STORE, "readwrite", (store) => store.delete(WORKSPACE_KEY));
}

export async function loadBurnerWalletFromIndexedDb(): Promise<BurnerWalletRecord | null> {
  const result = await withStore<MetaRecord<BurnerWalletRecord>>(META_STORE, "readonly", (store) =>
    store.get(BURNER_KEY)
  );
  return result?.value ?? null;
}

export async function saveBurnerWalletToIndexedDb(record: BurnerWalletRecord): Promise<void> {
  await withStore<void>(META_STORE, "readwrite", (store) =>
    store.put({
      id: BURNER_KEY,
      value: record,
      updatedAt: Date.now(),
    } as MetaRecord<BurnerWalletRecord>)
  );
}

export async function clearBurnerWalletInIndexedDb(): Promise<void> {
  await withStore<void>(META_STORE, "readwrite", (store) => store.delete(BURNER_KEY));
}

export async function loadQuestProgressFromIndexedDb(questId: string): Promise<QuestProgressRecord | null> {
  const result = await withStore<QuestProgressRecord>(PROGRESS_STORE, "readonly", (store) => store.get(questId));
  return result ?? null;
}

export async function saveQuestProgressToIndexedDb(progress: QuestProgressRecord): Promise<void> {
  await withStore<void>(PROGRESS_STORE, "readwrite", (store) => store.put(progress));
}
