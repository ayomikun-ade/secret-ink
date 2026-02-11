"use client";

import { use, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getFingerprint } from "@/lib/fingerprint";
import {
  Heart,
  MessageSquare,
  Send,
  Clock,
  Smile,
  Zap,
  Frown,
  Loader2,
  Share2,
  Check,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
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
        <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
      </div>
    );
  }

  if (board === null) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Heart className="w-10 h-10 text-neutral-700" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 mb-4">
          Space Not Found
        </h1>
        <p className="text-neutral-700 font-medium mb-8">
          This private board has dissolved into the ink or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold shadow-lg hover:bg-neutral-900/90 transition-all gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <header className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-neutral-900 hover:text-brand-red font-bold mb-8 transition-all"
          >
            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-all border border-neutral-100">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white rounded-full text-xs font-black tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-brand-red" /> Private Board
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                {board.name}
              </h1>
              {board.description && (
                <p className="text-neutral-700 font-medium text-lg max-w-xl">
                  {board.description}
                </p>
              )}
            </div>
            <button
              onClick={handleCopyLink}
              className="group relative flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-2xl hover:bg-neutral-100 transition-all text-sm font-bold shadow-sm hover:shadow-md border border-neutral-100 self-start md:self-auto active:scale-95"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {copied ? "Link Copied!" : "Invite via Link"}
            </button>
          </div>
        </header>

        <section className="relative group mb-16">
          <div className="absolute -inset-1 bg-neutral-900/5 rounded-4xl blur opacity-25 transition duration-1000"></div>
          <div className="relative bg-white rounded-[1.8rem] shadow-xl shadow-neutral-900/5 p-8 border border-neutral-100">
            <h2 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-brand-red" />
              Cast Your Whisper
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  required
                  maxLength={300}
                  placeholder="The floor is yours... anonymously."
                  className="w-full p-6 rounded-2xl bg-neutral-100 border-2 border-transparent focus:border-brand-red focus:bg-white outline-none transition-all min-h-40 resize-none text-neutral-900 text-lg placeholder:text-neutral-700/30 font-medium"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="absolute bottom-4 right-4">
                  <span
                    className={cn(
                      "text-xs font-black tracking-tighter transition-colors",
                      content.length > 280
                        ? "text-brand-red"
                        : "text-neutral-700/30",
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
                    className="w-full px-6 py-4 rounded-xl bg-neutral-100 border-2 border-transparent focus:border-brand-red focus:bg-white outline-none transition-all text-sm font-bold placeholder:text-neutral-700/30"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !content}
                  className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-900/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Post Whisper
                </button>
              </div>
              {error && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-brand-red text-xs font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </section>

        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-3">
              Whispers in the Wind
              {confessions && (
                <span className="bg-neutral-900 text-white text-sm px-3 py-1 rounded-full font-black">
                  {confessions.length}
                </span>
              )}
            </h2>
          </div>

          {!confessions ? (
            <div className="flex flex-col items-center py-20 animate-pulse">
              <Loader2 className="w-8 h-8 text-neutral-700 animate-spin mb-4" />
              <p className="text-neutral-700 font-bold uppercase tracking-widest text-xs">
                Summoning Whispers...
              </p>
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border-4 border-dashed border-neutral-100">
              <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-neutral-700" />
              </div>
              <p className="text-neutral-900 font-black text-lg">
                Silence is golden, but whispers are better.
              </p>
              <p className="text-neutral-700 font-medium">
                Be the first to speak into the ink.
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
    <div className="group relative bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl hover:shadow-neutral-900/5 transition-all duration-500 border border-neutral-100 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-100">
            <span className="text-neutral-900 font-black text-xs uppercase">
              {(confession.nickname || "A")[0]}
            </span>
          </div>
          <span className="font-black text-neutral-900 tracking-tight">
            {confession.nickname || "Anonymous"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-700 font-bold text-[10px] uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(confession.createdAt)} ago
        </div>
      </div>
      <p className="text-neutral-900 text-xl leading-relaxed mb-8 font-medium whitespace-pre-wrap tracking-tight">
        {confession.content}
      </p>
      <div className="flex flex-wrap gap-3">
        <ReactionButton
          icon={<Heart className="w-4 h-4" />}
          count={counts?.love || 0}
          onClick={() => handleReact("love")}
          color="hover:bg-brand-red hover:text-white hover:border-brand-red text-neutral-700 border-neutral-100"
          label="Love"
        />
        <ReactionButton
          icon={<Smile className="w-4 h-4" />}
          count={counts?.laugh || 0}
          onClick={() => handleReact("laugh")}
          color="hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-700 border-neutral-100"
          label="Haha"
        />
        <ReactionButton
          icon={<Zap className="w-4 h-4" />}
          count={counts?.shock || 0}
          onClick={() => handleReact("shock")}
          color="hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-700 border-neutral-100"
          label="Wow"
        />
        <ReactionButton
          icon={<Frown className="w-4 h-4" />}
          count={counts?.sad || 0}
          onClick={() => handleReact("sad")}
          color="hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-neutral-700 border-neutral-100"
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
        "flex items-center gap-2 px-4 py-2 rounded-xl border bg-white transition-all duration-300 text-sm font-black active:scale-90 group/btn shadow-sm",
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
