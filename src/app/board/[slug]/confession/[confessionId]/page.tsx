"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { getFingerprint } from "@/lib/fingerprint";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  MessageAdd01Icon,
  SentIcon,
  Clock01Icon,
  ArrowLeft01Icon,
  SparklesIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactionBar } from "@/components/ReactionBar";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ConfessionThreadPage({
  params,
}: {
  params: Promise<{ slug: string; confessionId: string }>;
}) {
  const { slug, confessionId } = use(params);
  const typedConfessionId = confessionId as Id<"confessions">;

  const board = useQuery(api.boards.getBySlug, { slug });
  const confession = useQuery(api.confessions.getById, {
    confessionId: typedConfessionId,
  });
  const replies = useQuery(api.replies.listByConfession, {
    confessionId: typedConfessionId,
  });

  const createReply = useMutation(api.replies.create);
  const toggleReaction = useMutation(api.reactions.toggle);

  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    setFingerprint(getFingerprint());
  }, []);

  const confessionReactions = useQuery(api.reactions.getCounts, {
    confessionId: typedConfessionId,
    fingerprint: fingerprint || undefined,
  });

  // Apply board theme to document
  useEffect(() => {
    if (board?.theme) {
      document.documentElement.setAttribute("data-theme", board.theme);
    }
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [board?.theme]);

  const handleReactConfession = (unified: string) => {
    if (!fingerprint) return;
    toggleReaction({
      confessionId: typedConfessionId,
      type: unified,
      fingerprint,
    });
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !board || !confession || !fingerprint) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await createReply({
        confessionId: typedConfessionId,
        content,
        nickname: nickname || undefined,
        fingerprint,
      });
      setContent("");
      setNickname("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (board === undefined || confession === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HugeiconsIcon
          icon={Loading03Icon}
          size={40}
          color="currentColor"
          strokeWidth={2}
          className="w-10 h-10 animate-spin text-brand-primary"
        />
      </div>
    );
  }

  if (board === null || confession === null || confession.boardId !== board._id) {
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
          Confession Not Found
        </h1>
        <p className="text-text-secondary font-medium mb-8">
          This confession or board has dissolved into the ink or never existed.
        </p>
        <Link
          href={`/board/${slug}`}
          className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold shadow-brand hover:bg-brand-primary-hover transition-all gap-2 active:scale-98"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={20}
            color="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          />{" "}
          Back to Board
        </Link>
      </div>
    );
  }

  const allowReplies = board.allowReplies !== false;
  const isViewerOP = Boolean(fingerprint && confession.fingerprint === fingerprint);

  return (
    <div className="font-sans min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <header className="mb-10">
          <Link
            href={`/board/${slug}`}
            className="group inline-flex items-center gap-2 text-text-primary hover:text-brand-primary font-bold mb-6 transition-all"
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
            Back to {board.name}
          </Link>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary text-white rounded-full text-xs font-black tracking-widest uppercase">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={12}
                color="currentColor"
                strokeWidth={2}
                className="w-3 h-3"
              />{" "}
              Confession Thread
            </div>
          </div>
        </header>

        {/* Parent Confession Card */}
        <section className="mb-12">
          <div className="relative glass p-8 rounded-4xl shadow-brand-lg border-2 border-brand-primary/40 overflow-hidden">
            <div className="flex max-md:flex-col max-md:gap-2 md:items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-primary/15 flex items-center justify-center border border-brand-primary/40">
                  <span className="text-brand-primary font-black text-sm uppercase">
                    {(confession.nickname || "A")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-text-primary text-lg tracking-tight">
                    {confession.nickname || "Anonymous"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider">
                    OP
                  </span>
                  {isViewerOP && (
                    <span className="px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary border border-border-primary text-[10px] font-black uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>
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

            <p className="text-text-primary text-2xl leading-relaxed mb-8 font-medium whitespace-pre-wrap tracking-tight">
              {confession.content}
            </p>

            <ReactionBar
              counts={confessionReactions?.counts}
              userReaction={confessionReactions?.userReaction}
              onToggleReaction={handleReactConfession}
            />
          </div>
        </section>

        {/* Reply Form */}
        {allowReplies ? (
          <section className="relative group mb-12">
            <div className="relative glass-subtle rounded-3xl border border-border-primary p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-text-primary mb-4 flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={MessageAdd01Icon}
                  size={20}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5 text-brand-primary"
                />
                Write a Reply
                {isViewerOP && (
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                    Replying as OP
                  </span>
                )}
              </h2>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <div className="relative">
                  <textarea
                    required
                    maxLength={250}
                    placeholder="Add an anonymous reply..."
                    className="w-full p-5 rounded-2xl bg-input-bg border-2 border-transparent focus:border-brand-primary focus:bg-input-focus outline-none transition-all min-h-28 resize-none text-text-primary text-base placeholder:text-text-muted/50 font-medium"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-4">
                    <span
                      className={cn(
                        "text-xs font-black tracking-tighter transition-colors",
                        content.length > 230
                          ? "text-brand-primary"
                          : "text-text-muted/50"
                      )}
                    >
                      {content.length} / 250
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-auto flex-1">
                    <input
                      type="text"
                      placeholder="Nickname (Optional)"
                      className="w-full px-5 py-3.5 rounded-xl bg-input-bg border-2 border-transparent focus:border-brand-primary focus:bg-input-focus outline-none transition-all text-sm font-bold placeholder:text-text-muted/50 text-text-primary"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-7 py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-2.5 shadow-brand active:scale-98 text-sm"
                  >
                    {isSubmitting ? (
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={18}
                        color="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4 animate-spin"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={SentIcon}
                        size={18}
                        color="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      />
                    )}
                    Post Reply
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
        ) : (
          <div className="mb-12 p-6 rounded-2xl bg-surface border border-border-primary text-center text-text-secondary font-bold text-sm">
            Replies are disabled on this board.
          </div>
        )}

        {/* Replies List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-black text-text-primary flex items-center gap-3">
              Replies
              {replies && (
                <span className="bg-brand-primary text-white text-xs px-3 py-1 rounded-full font-black">
                  {replies.length}
                </span>
              )}
            </h3>
          </div>

          {!replies ? (
            <div className="flex flex-col items-center py-16 animate-pulse">
              <HugeiconsIcon
                icon={Loading03Icon}
                size={28}
                color="currentColor"
                strokeWidth={2}
                className="w-7 h-7 text-brand-primary animate-spin mb-3"
              />
              <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">
                Loading Replies...
              </p>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-4xl border-2 border-dashed border-border-primary">
              <p className="text-text-primary font-black text-base mb-1">
                No replies yet.
              </p>
              <p className="text-text-secondary text-sm font-medium">
                {allowReplies
                  ? "Start the conversation by posting a reply above."
                  : "This confession has no replies."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <ReplyCard
                  key={reply._id}
                  reply={reply}
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

function ReplyCard({
  reply,
  fingerprint,
}: {
  reply: {
    _id: Id<"replies">;
    confessionId: Id<"confessions">;
    boardId: Id<"boards">;
    content: string;
    nickname?: string;
    createdAt: number;
    isAuthor: boolean;
  };
  fingerprint: string;
}) {
  const reactionData = useQuery(api.reactions.getCounts, {
    replyId: reply._id,
    fingerprint: fingerprint || undefined,
  });
  const toggleReaction = useMutation(api.reactions.toggle);

  const handleReact = (unified: string) => {
    if (!fingerprint) return;
    toggleReaction({ replyId: reply._id, type: unified, fingerprint });
  };

  return (
    <div className="group relative glass-subtle p-6 rounded-3xl shadow-sm border border-border-primary hover:border-brand-primary/30 transition-all duration-300">
      <div className="flex max-md:flex-col max-md:gap-2 md:items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border",
              reply.isAuthor
                ? "bg-brand-primary/15 border-brand-primary/40"
                : "bg-surface-elevated border-border-primary"
            )}
          >
            <span className="text-brand-primary font-black text-xs uppercase">
              {(reply.nickname || "A")[0]}
            </span>
          </div>
          <span className="font-black text-text-primary text-sm tracking-tight">
            {reply.nickname || "Anonymous"}
          </span>
          {reply.isAuthor && (
            <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black uppercase tracking-wider">
              OP
            </span>
          )}
        </div>
        <div className="flex max-md:w-fit font-mono items-center gap-1.5 text-text-secondary font-bold text-[10px] uppercase tracking-widest bg-surface-elevated px-2.5 py-1 rounded-full border border-border-secondary">
          <HugeiconsIcon
            icon={Clock01Icon}
            size={11}
            color="currentColor"
            strokeWidth={2}
            className="w-3 h-3"
          />
          {formatDistanceToNow(reply.createdAt)} ago
        </div>
      </div>

      <p className="text-text-primary text-base leading-relaxed mb-5 font-medium whitespace-pre-wrap tracking-tight">
        {reply.content}
      </p>

      <ReactionBar
        counts={reactionData?.counts}
        userReaction={reactionData?.userReaction}
        onToggleReaction={handleReact}
        compact
      />
    </div>
  );
}
