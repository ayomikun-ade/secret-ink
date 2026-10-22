"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
  itemLabel?: string;
  compact?: boolean;
}

export function ConfirmDeleteButton({
  onConfirm,
  isDeleting = false,
  itemLabel = "post",
  compact = false,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isDeleting}
          title={`Delete your ${itemLabel} (available for 5 minutes after posting)`}
          className={cn(
            "inline-flex items-center gap-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50",
            compact ? "px-2 py-0.5" : "px-2.5 py-1"
          )}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            size={compact ? 11 : 12}
            color="currentColor"
            strokeWidth={2}
            className={compact ? "w-2.5 h-2.5" : "w-3 h-3"}
          />
          Delete
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-64 p-4 rounded-2xl bg-surface-elevated border-2 border-border-primary shadow-xl"
      >
        <div className="space-y-3">
          <div>
            <p className="text-xs font-black text-text-primary uppercase tracking-wider">
              Delete this {itemLabel}?
            </p>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              This will permanently remove your {itemLabel}.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary bg-surface border border-border-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={12}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3 animate-spin"
                />
              ) : (
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={12}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3"
                />
              )}
              Yes, Delete
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
