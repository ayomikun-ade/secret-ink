"use client";

// Dark mode only - no light mode toggle needed
// Board-specific brand color themes are handled via data-theme attribute in board pages
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
