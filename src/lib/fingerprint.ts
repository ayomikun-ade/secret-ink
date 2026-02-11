export function getFingerprint(): string {
  if (typeof window === "undefined") return "server";

  let id = localStorage.getItem("secretink_id");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("secretink_id", id);
  }

  const userAgent = window.navigator.userAgent;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Simple hash-like string
  return btoa(`${id}-${userAgent}-${timezone}`).substring(0, 32);
}
