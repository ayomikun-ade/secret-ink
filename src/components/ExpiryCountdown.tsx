"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface ExpiryCountdownProps {
  expiresAt?: number;
  className?: string;
}

export function ExpiryCountdown({
  expiresAt,
  className,
}: ExpiryCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  const remainingMs = Math.max(0, expiresAt - now);
  if (remainingMs <= 0) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-mono",
          className
        )}
      >
        <HugeiconsIcon
          icon={Clock01Icon}
          size={12}
          color="currentColor"
          strokeWidth={2}
          className="w-3 h-3"
        />
        Expired
      </div>
    );
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUnderOneHour = remainingMs < 60 * 60 * 1000;
  const isUnder24Hours = remainingMs < 24 * 60 * 60 * 1000;

  const pad = (n: number) => String(n).padStart(2, "0");

  const label = isUnder24Hours
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)} left`
    : `${days}d ${hours}h left`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase font-mono border transition-colors",
        isUnderOneHour
          ? "bg-red-500/15 text-red-400 border-red-500/30 animate-pulse"
          : "bg-surface-elevated text-text-secondary border-border-primary",
        className
      )}
      title={`Dissolves at ${new Date(expiresAt).toLocaleString()}`}
    >
      <HugeiconsIcon
        icon={Clock01Icon}
        size={12}
        color="currentColor"
        strokeWidth={2}
        className="w-3 h-3 text-brand-primary"
      />
      <span>{label}</span>
    </div>
  );
}
