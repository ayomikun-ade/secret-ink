"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getFingerprint } from "@/lib/fingerprint";
import { Loader2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  MessageAdd01Icon,
  SentIcon,
  Clock01Icon,
  SmileIcon,
  SurpriseIcon,
  UnhappyIcon,
  Share08Icon,
  TickDouble02Icon,
  ArrowLeft01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../../../convex/_generated/dataModel";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const board = useQuery(api.boards.getBySlug, { slug });
  const confessions = useQuery(
    api.confessions.list,
    board ? { boardId: board._id } : "skip",
  );
  const createConfession = useMutation(api.confessions.create);

  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    setFingerprint(getFingerprint());
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (board?.theme) {
      document.documentElement.setAttribute("data-theme", board.theme);
    }
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [board?.theme]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !board || !fingerprint) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await createConfession({
        boardId: board._id,
        content,
        nickname: nickname || undefined,
        fingerprint,
      });
      setContent("");
      setNickname("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post confession",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (board === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (board === null) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-surface w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-primary">
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={24}
            color="currentColor"
            strokeWidth={2}
            className="w-10 h-10 text-text-secondary"
          />
        </div>
        <h1 className="text-3xl font-black text-text-primary mb-4">
          Space Not Found
        </h1>
        <p className="text-text-secondary font-medium mb-8">
          This private board has dissolved into the ink or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold shadow-brand hover:bg-brand-primary-hover transition-all gap-2 active:scale-98"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={20}
            color="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          />{" "}
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <header className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-text-primary hover:text-brand-primary font-bold mb-8 transition-all"
          >
            <div className="bg-surface p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all border border-border-primary">
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              />
            </div>
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary text-white rounded-full text-xs font-black tracking-widest uppercase">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={12}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-3 h-3"
                />{" "}
                Private Board
              </div>
              <h1 className="text-4xl font-serif md:text-5xl font-black text-text-primary tracking-tight leading-tight">
                {board.name}
              </h1>
              {board.description && (
                <p className="text-text-secondary font-medium text-lg max-w-xl">
                  {board.description}
                </p>
              )}
            </div>
            <button
              onClick={handleCopyLink}
              className="group relative flex items-center gap-2 px-6 py-3 bg-surface text-text-primary rounded-2xl hover:bg-surface-elevated transition-all text-sm font-bold shadow-sm hover:shadow-md border border-border-primary self-start md:self-auto active:scale-95"
            >
              {copied ? (
                <HugeiconsIcon
                  icon={TickDouble02Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-green-500"
                />
              ) : (
                <HugeiconsIcon
                  icon={Share08Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                />
              )}
              {copied ? "Link Copied!" : "Invite via Link"}
            </button>
          </div>
        </header>

        <section className="relative group mb-16">
          <div className="absolute -inset-1 bg-brand-primary/10 rounded-4xl blur opacity-30 transition duration-1000"></div>
          <div className="relative glass rounded-[1.8rem] shadow-brand-lg p-8">
            <h2 className="text-xl font-black text-text-primary mb-6 flex items-center gap-3">
              <HugeiconsIcon
                icon={MessageAdd01Icon}
                size={24}
                color="currentColor"
                strokeWidth={2}
                className="w-6 h-6 text-brand-primary"
              />
              Share Your Thoughts
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  required
                  maxLength={300}
                  placeholder="Share your thoughts anonymously..."
                  className="w-full p-6 rounded-2xl bg-input-bg border-2 border-transparent focus:border-brand-primary focus:bg-input-focus outline-none transition-all min-h-40 resize-none text-text-primary text-lg placeholder:text-text-muted/50 font-medium"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <span
                    className={cn(
                      "text-xs font-black tracking-tighter transition-colors",
                      content.length > 280
                        ? "text-brand-primary"
                        : "text-text-muted/50",
                    )}
                  >
                    {content.length} / 300
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-auto flex-1 group">
                  <input
                    type="text"
                    placeholder="Nickname (Optional)"
                    className="w-full px-6 py-4 rounded-xl bg-input-bg border-2 border-transparent focus:border-brand-primary focus:bg-input-focus outline-none transition-all text-sm font-bold placeholder:text-text-muted/50 text-text-primary"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !content}
                  className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-brand active:scale-98"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <HugeiconsIcon
                      icon={SentIcon}
                      size={24}
                      color="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5"
                    />
                  )}
                  Post Message
                </button>
              </div>
              {error && (
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                  <p className="text-red-400 text-xs font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </section>

        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-black text-text-primary flex items-center gap-3">
              Recent Messages
              {confessions && (
                <span className="bg-brand-primary text-white text-sm px-3 py-1 rounded-full font-black">
                  {confessions.length}
                </span>
              )}
            </h2>
          </div>

          {!confessions ? (
            <div className="flex flex-col items-center py-20 animate-pulse">
              <Loader2 className="w-8 h-8 text-text-secondary animate-spin mb-4" />
              <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">
                Loading Messages...
              </p>
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-24 bg-surface rounded-[2.5rem] border-4 border-dashed border-border-primary">
              <div className="bg-surface-elevated w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-border-primary">
                <HugeiconsIcon
                  icon={MessageAdd01Icon}
                  size={40}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-10 h-10 text-text-secondary"
                />
              </div>
              <p className="text-text-primary font-black text-lg">
                No messages yet.
              </p>
              <p className="text-text-secondary font-medium">
                Be the first to share your thoughts.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {confessions.map((confession) => (
                <ConfessionCard
                  key={confession._id}
                  confession={confession}
                  fingerprint={fingerprint}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfessionCard({
  confession,
  fingerprint,
}: {
  confession: Doc<"confessions">;
  fingerprint: string;
}) {
  const counts = useQuery(api.reactions.getCounts, {
    confessionId: confession._id,
  });
  const toggleReaction = useMutation(api.reactions.toggle);

  const handleReact = (type: "love" | "laugh" | "shock" | "sad") => {
    if (!fingerprint) return;
    toggleReaction({ confessionId: confession._id, type, fingerprint });
  };

  return (
    <div className="group relative glass-subtle p-8 rounded-4xl shadow-sm hover:shadow-brand transition-all duration-500 border border-border-primary hover:border-brand-primary/30 overflow-hidden">
      <div className="flex max-md:flex-col max-md:gap-2 md:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center border border-border-primary">
            <span className="text-brand-primary font-black text-xs uppercase">
              {(confession.nickname || "A")[0]}
            </span>
          </div>
          <span className="font-black text-text-primary tracking-tight">
            {confession.nickname || "Anonymous"}
          </span>
        </div>
        <div className="flex max-md:w-fit font-mono items-center gap-1.5 text-text-secondary font-bold text-[10px] uppercase tracking-widest bg-surface-elevated px-3 py-1 rounded-full border border-border-secondary">
          <HugeiconsIcon
            icon={Clock01Icon}
            size={12}
            color="currentColor"
            strokeWidth={2}
            className="w-3 h-3"
          />
          {formatDistanceToNow(confession.createdAt)} ago
        </div>
      </div>
      <p className="text-text-primary text-xl leading-relaxed mb-8 font-medium whitespace-pre-wrap tracking-tight">
        {confession.content}
      </p>
      <div className="flex flex-wrap gap-3">
        <ReactionButton
          icon={
            <HugeiconsIcon
              icon={FavouriteIcon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            />
          }
          count={counts?.love || 0}
          onClick={() => handleReact("love")}
          color="hover:bg-brand-primary hover:text-white hover:border-brand-primary text-text-secondary border-border-primary"
          label="Love"
        />
        <ReactionButton
          icon={
            <HugeiconsIcon
              icon={SmileIcon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            />
          }
          count={counts?.laugh || 0}
          onClick={() => handleReact("laugh")}
          color="hover:bg-surface-elevated hover:text-text-primary hover:border-border-primary text-text-secondary border-border-primary"
          label="Haha"
        />
        <ReactionButton
          icon={
            <HugeiconsIcon
              icon={SurpriseIcon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            />
          }
          count={counts?.shock || 0}
          onClick={() => handleReact("shock")}
          color="hover:bg-surface-elevated hover:text-text-primary hover:border-border-primary text-text-secondary border-border-primary"
          label="Wow"
        />
        <ReactionButton
          icon={
            <HugeiconsIcon
              icon={UnhappyIcon}
              size={16}
              color="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            />
          }
          count={counts?.sad || 0}
          onClick={() => handleReact("sad")}
          color="hover:bg-surface-elevated hover:text-text-primary hover:border-border-primary text-text-secondary border-border-primary"
          label="Sad"
        />
      </div>
    </div>
  );
}

function ReactionButton({
  icon,
  count,
  onClick,
  color,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
  color: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border bg-surface transition-all duration-300 text-sm font-black active:scale-95 group/btn shadow-sm",
        color,
      )}
    >
      <span className="transition-transform group-hover/btn:scale-125 duration-300">
        {icon}
      </span>
      <span className="min-w-3">{count}</span>
      <span className="text-[10px] uppercase opacity-0 group-hover/btn:opacity-100 transition-opacity w-0 group-hover/btn:w-auto overflow-hidden tracking-tighter ml-0 group-hover/btn:ml-1">
        {label}
      </span>
    </button>
  );
}
