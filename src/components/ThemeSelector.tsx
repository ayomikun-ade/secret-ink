"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TickDouble02Icon } from "@hugeicons/core-free-icons";
import { useEffect } from "react";

export type Theme = "indigo" | "teal" | "amber" | "red" | "purple" | "emerald";

const THEMES: { value: Theme; label: string; color: string; description: string }[] = [
  { value: "indigo", label: "Indigo", color: "#6366f1", description: "Professional & trustworthy" },
  { value: "teal", label: "Teal", color: "#22d3ee", description: "Modern & fresh" },
  { value: "amber", label: "Amber", color: "#fbbf24", description: "Warm & energetic" },
  { value: "red", label: "Red", color: "#f87171", description: "Bold & urgent" },
  { value: "purple", label: "Purple", color: "#a855f7", description: "Creative & unique" },
  { value: "emerald", label: "Emerald", color: "#34d399", description: "Growth & positive" },
];

interface ThemeSelectorProps {
  selected: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSelector({ selected, onChange }: ThemeSelectorProps) {
  // Apply theme in real-time for preview
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selected);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [selected]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-text-primary mb-2 ml-1">
        Board Color Theme
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.value}
            type="button"
            onClick={() => onChange(theme.value)}
            className={`group relative p-4 rounded-lg border-3 transition-all duration-200 text-left ${
              selected === theme.value
                ? "border-brand-primary bg-surface-elevated shadow-brutal-hover -translate-y-0.5"
                : "border-border-primary bg-surface hover:border-brand-primary/50 hover:shadow-brutal"
            }`}
            style={
              selected === theme.value
                ? { borderColor: theme.color, boxShadow: `6px 6px 0px ${theme.color}40` }
                : undefined
            }
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-8 h-8 rounded-md shadow-sm transition-all duration-200 group-hover:scale-105 border-2"
                style={{ backgroundColor: theme.color, borderColor: theme.color }}
              />
              {selected === theme.value && (
                <div className="text-white p-1 rounded-md border-2" style={{ backgroundColor: theme.color, borderColor: theme.color }}>
                  <HugeiconsIcon
                    icon={TickDouble02Icon}
                    size={12}
                    color="currentColor"
                    strokeWidth={2}
                    className="w-3 h-3"
                  />
                </div>
              )}
            </div>
            <div className="font-bold text-text-primary text-sm mb-1">
              {theme.label}
            </div>
            <div className="text-xs text-text-secondary leading-tight">
              {theme.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
