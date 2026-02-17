/**
 * Monaco Editor Model Registry
 * Manages Monaco editor models for the playground with cursor/undo preservation
 */

import type { editor } from "monaco-editor";

interface ModelEntry {
  model: editor.ITextModel;
  viewState: editor.ICodeEditorViewState | null;
  lastAccessed: number;
}

interface ModelOptions {
  language?: string;
  content?: string;
  readOnly?: boolean;
}

class ModelRegistry {
  private models = new Map<string, ModelEntry>();
  private monacoInstance: typeof import("monaco-editor") | null = null;
  private maxModels = 50; // Maximum number of models to keep in memory

  /**
   * Initialize the registry with the Monaco instance
   */
  init(monaco: typeof import("monaco-editor")): void {
    this.monacoInstance = monaco;
  }

  /**
   * Get or create a model for a file path
   */
  getOrCreateModel(path: string, options: ModelOptions = {}): editor.ITextModel | null {
    if (!this.monacoInstance) {
      console.warn("ModelRegistry not initialized");
      return null;
    }

    const existing = this.models.get(path);
    if (existing) {
      existing.lastAccessed = Date.now();
      return existing.model;
    }

    // Clean up old models if we're at the limit
    if (this.models.size >= this.maxModels) {
      this.cleanupOldModels();
    }

    // Create new model
    const uri = this.monacoInstance.Uri.file(path);
    const language = options.language ?? this.inferLanguage(path);
    const content = options.content ?? "";

    // Check if model already exists in Monaco (e.g., from a previous session)
    let model = this.monacoInstance.editor.getModel(uri);
    if (!model) {
      model = this.monacoInstance.editor.createModel(content, language, uri);
    }

    const entry: ModelEntry = {
      model,
      viewState: null,
      lastAccessed: Date.now(),
    };

    this.models.set(path, entry);
    return model;
  }

  /**
   * Get an existing model without creating one
   */
  getModel(path: string): editor.ITextModel | null {
    return this.models.get(path)?.model ?? null;
  }

  /**
   * Save the view state for a model (call when switching away from editor)
   */
  saveViewState(path: string, viewState: editor.ICodeEditorViewState | null): void {
    const entry = this.models.get(path);
    if (entry) {
      entry.viewState = viewState;
      entry.lastAccessed = Date.now();
    }
  }

  /**
   * Get the saved view state for a model
   */
  getViewState(path: string): editor.ICodeEditorViewState | null {
    return this.models.get(path)?.viewState ?? null;
  }

  /**
   * Update model content without losing undo stack
   * Only updates if the content is different from current
   */
  updateModelContent(path: string, content: string): void {
    const entry = this.models.get(path);
    if (!entry) return;

    const model = entry.model;
    const currentContent = model.getValue();

    if (currentContent !== content) {
      // Use pushEditOperations to preserve undo stack
      const range = model.getFullModelRange();
      const op = {
        range,
        text: content,
        forceMoveMarkers: true,
      };
      model.pushEditOperations([], [op], () => null);
    }

    entry.lastAccessed = Date.now();
  }

  /**
   * Dispose a model
   */
  disposeModel(path: string): void {
    const entry = this.models.get(path);
    if (entry) {
      entry.model.dispose();
      this.models.delete(path);
    }
  }

  /**
   * Dispose all models
   */
  disposeAll(): void {
    for (const entry of this.models.values()) {
      entry.model.dispose();
    }
    this.models.clear();
  }

  /**
   * Check if a model exists
   */
  hasModel(path: string): boolean {
    return this.models.has(path);
  }

  /**
   * Get all model paths
   */
  getModelPaths(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Get the number of models
   */
  getModelCount(): number {
    return this.models.size;
  }

  /**
   * Clean up old models when we exceed the limit
   */
  private cleanupOldModels(): void {
    // Sort by last accessed (oldest first)
    const entries = Array.from(this.models.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed
    );

    // Remove oldest 25% of models
    const toRemove = Math.ceil(this.maxModels * 0.25);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const [path, entry] = entries[i];
      entry.model.dispose();
      this.models.delete(path);
    }
  }

  /**
   * Infer language from file path
   */
  private inferLanguage(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      rs: "rust",
      md: "markdown",
      txt: "plaintext",
      yml: "yaml",
      yaml: "yaml",
    };
    return map[ext] ?? "plaintext";
  }
}

export const modelRegistry = new ModelRegistry();

// Re-export types
export type { ModelOptions };
