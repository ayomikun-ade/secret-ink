"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Emoji, EmojiStyle, Theme, type EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmileIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

const DEFAULT_REACTIONS: string[] = [
  "2764-fe0f", // ❤️ Love
  "1f602",     // 😂 Laugh
  "1f44d",     // 👍 Thumbs up
  "1f44e",     // 👎 Thumbs down
];

const MAX_VISIBLE = 6;

interface ReactionBarProps {
  counts?: Record<string, number>;
  userReaction?: string | null;
  onToggleReaction: (unified: string) => void;
  compact?: boolean;
}

export function ReactionBar({
  counts = {},
  userReaction = null,
  onToggleReaction,
  compact = false,
}: ReactionBarProps) {
  const [showAll, setShowAll] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasAnyReaction = Object.values(counts).some((count) => count > 0);

  // Show the 4 standard quick-react emojis only when there are no reactions yet;
  // once any reaction exists, only display the reacted emojis.
  const allReactions = hasAnyReaction
    ? Object.entries(counts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([unified]) => unified)
    : DEFAULT_REACTIONS;

  // Ensure if the user's active reaction is beyond MAX_VISIBLE, it stays visible when collapsed
  let visibleReactions = showAll
    ? allReactions
    : allReactions.slice(0, MAX_VISIBLE);

  if (
    !showAll &&
    userReaction &&
    allReactions.length > MAX_VISIBLE &&
    !visibleReactions.includes(userReaction)
  ) {
    visibleReactions = [
      ...visibleReactions.slice(0, MAX_VISIBLE - 1),
      userReaction,
    ];
  }

  const hiddenCount = allReactions.length - MAX_VISIBLE;

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    onToggleReaction(emojiData.unified.toLowerCase());
    setPickerOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {visibleReactions.map((unified) => {
        const count = counts[unified] || 0;
        const isActive = userReaction === unified;

        return (
          <button
            key={unified}
            type="button"
            onClick={() => onToggleReaction(unified)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center rounded-xl border transition-all duration-300 font-black active:scale-95 group/btn shadow-sm",
              compact ? "px-3 py-1.5 text-xs gap-1.5" : "px-3.5 py-2 text-sm gap-2",
              isActive
                ? "bg-brand-primary text-white border-brand-primary shadow-brand"
                : "bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary border-border-primary"
            )}
          >
            <span className="inline-flex items-center justify-center transition-transform group-hover/btn:scale-125 duration-300">
              <Emoji
                unified={unified}
                emojiStyle={EmojiStyle.APPLE}
                size={compact ? 16 : 18}
              />
            </span>
            <span className="min-w-3">{count}</span>
          </button>
        );
      })}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className={cn(
            "flex items-center rounded-xl border border-border-primary bg-surface-elevated hover:border-brand-primary/50 text-text-secondary hover:text-text-primary transition-all duration-200 font-black active:scale-95",
            compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
          )}
        >
          {showAll ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}

      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Add emoji reaction"
            className={cn(
              "flex items-center justify-center rounded-xl border border-dashed border-border-primary bg-surface hover:bg-surface-elevated hover:border-brand-primary text-text-secondary hover:text-text-primary transition-all duration-200 font-black active:scale-95 shadow-sm",
              compact ? "px-2.5 py-1.5 text-xs gap-1" : "px-3 py-2 text-sm gap-1"
            )}
          >
            <HugeiconsIcon
              icon={SmileIcon}
              size={compact ? 14 : 16}
              color="currentColor"
              strokeWidth={2}
              className={compact ? "w-3.5 h-3.5" : "w-4 h-4"}
            />
            <span className="text-xs leading-none">+</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-auto p-0 border-none bg-transparent shadow-2xl"
        >
          <EmojiPicker
            emojiStyle={EmojiStyle.APPLE}
            theme={Theme.DARK}
            onEmojiClick={handleEmojiSelect}
            lazyLoadEmojis
            width={320}
            height={380}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
