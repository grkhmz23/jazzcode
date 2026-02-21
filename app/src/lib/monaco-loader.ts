/**
 * Configures @monaco-editor/react to load Monaco from local public/ files
 * instead of CDN. The CSP blocks external script sources (script-src 'self'),
 * so Monaco must be served from the same origin.
 *
 * This is a singleton — safe to call multiple times.
 */
let configured = false;

export async function configureMonacoLoader() {
  if (configured) return;
  configured = true;
  const { loader } = await import("@monaco-editor/react");
  loader.config({ paths: { vs: "/monaco-editor/min/vs" } });
}
