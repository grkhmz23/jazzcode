const GUEST_SCOPE_KEY = "playground-anon-scope-id";

function randomScopeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getOrCreateGuestScopeId(): string {
  if (typeof window === "undefined") {
    return "guest:server";
  }
  const existing = window.localStorage.getItem(GUEST_SCOPE_KEY);
  if (existing) {
    return existing;
  }
  const created = `guest:${randomScopeId()}`;
  window.localStorage.setItem(GUEST_SCOPE_KEY, created);
  return created;
}

export function buildWorkspaceScope(userId: string | null): string {
  if (userId) {
    return `user:${userId}`;
  }
  return getOrCreateGuestScopeId();
}
