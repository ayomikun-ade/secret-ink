"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TickDouble02Icon } from "@hugeicons/core-free-icons";

export type Theme = "indigo" | "teal" | "amber" | "red" | "purple" | "emerald";

const THEMES: { value: Theme; label: string; color: string; description: string }[] = [
  { value: "indigo", label: "Indigo", color: "#4F46E5", description: "Professional & trustworthy" },
  { value: "teal", label: "Teal", color: "#06B6D4", description: "Modern & fresh" },
  { value: "amber", label: "Amber", color: "#F59E0B", description: "Warm & energetic" },
  { value: "red", label: "Red", color: "#ef4444", description: "Bold & urgent" },
  { value: "purple", label: "Purple", color: "#9333EA", description: "Creative & unique" },
  { value: "emerald", label: "Emerald", color: "#10B981", description: "Growth & positive" },
];

interface ThemeSelectorProps {
  selected: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSelector({ selected, onChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-neutral-900 mb-2 ml-1">
        Board Color Theme
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.value}
            type="button"
            onClick={() => onChange(theme.value)}
            className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              selected === theme.value
                ? "border-neutral-900 bg-neutral-50 shadow-md"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className="w-8 h-8 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: theme.color }}
              />
              {selected === theme.value && (
                <div className="bg-neutral-900 text-white p-1 rounded-full">
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
            <div className="font-bold text-neutral-900 text-sm mb-1">
              {theme.label}
            </div>
            <div className="text-xs text-neutral-700 leading-tight">
              {theme.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
