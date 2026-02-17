const DB_NAME = "playground-git-v1";
const DB_VERSION = 1;
const STORE_NAME = "objects";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class GitObjectStore {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (!this.db) {
      this.db = await openDb();
    }
  }

  private getDb(): IDBDatabase {
    if (!this.db) {
      throw new Error("GitObjectStore not initialized. Call init() first.");
    }
    return this.db;
  }

  async readFile(path: string): Promise<Uint8Array | null> {
    const db = this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(path);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    const db = this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(data, path);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(path: string): Promise<void> {
    const db = this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(path);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const db = this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = () => {
        const keys = (request.result as string[]).filter(
          (key) => !prefix || key.startsWith(prefix)
        );
        resolve(keys);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async stat(path: string): Promise<{ size: number } | null> {
    const data = await this.readFile(path);
    if (!data) return null;
    return { size: data.byteLength };
  }

  async clear(): Promise<void> {
    const db = this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
