const STORAGE_KEY = "murmer_recent_boards";
const MAX_RECENT_BOARDS = 6;

export function getRecentBoardSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}

export function addRecentBoardSlug(slug: string): string[] {
  if (typeof window === "undefined" || !slug) return [];
  try {
    const existing = getRecentBoardSlugs().filter((s) => s !== slug);
    const updated = [slug, ...existing].slice(0, MAX_RECENT_BOARDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeRecentBoardSlug(slug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const updated = getRecentBoardSlugs().filter((s) => s !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
