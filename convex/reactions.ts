import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const LEGACY_MAP: Record<string, string> = {
  love: "2764-fe0f",
  laugh: "1f602",
  shock: "1f631",
  sad: "1f622",
};

function normalizeReactionType(type: string): string {
  const normalized = type.trim().toLowerCase();
  return LEGACY_MAP[normalized] ?? normalized;
}

export const toggle = mutation({
  args: {
    confessionId: v.optional(v.id("confessions")),
    replyId: v.optional(v.id("replies")),
    type: v.string(),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.confessionId && !args.replyId) {
      throw new Error("Either confessionId or replyId must be provided");
    }

    const type = normalizeReactionType(args.type);
    if (!type || type.length > 40) {
      throw new Error("Invalid reaction emoji");
    }

    if (args.confessionId) {
      const confession = await ctx.db.get(args.confessionId);
      if (!confession) throw new Error("Post not found");
      if (confession.expiresAt && confession.expiresAt < Date.now()) {
        throw new Error("Post has expired");
      }

      const existing = await ctx.db
        .query("reactions")
        .withIndex("by_confessionId_and_fingerprint", (q) =>
          q
            .eq("confessionId", args.confessionId)
            .eq("fingerprint", args.fingerprint)
        )
        .unique();

      if (existing) {
        if (normalizeReactionType(existing.type) === type) {
          await ctx.db.delete(existing._id);
          return { action: "removed" };
        } else {
          await ctx.db.patch(existing._id, {
            type,
            createdAt: Date.now(),
          });
          return { action: "updated" };
        }
      }

      await ctx.db.insert("reactions", {
        confessionId: args.confessionId,
        type,
        fingerprint: args.fingerprint,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }

    if (args.replyId) {
      const reply = await ctx.db.get(args.replyId);
      if (!reply) throw new Error("Reply not found");

      const confession = await ctx.db.get(reply.confessionId);
      if (
        !confession ||
        (confession.expiresAt && confession.expiresAt < Date.now())
      ) {
        throw new Error("Parent post has expired");
      }

      const existing = await ctx.db
        .query("reactions")
        .withIndex("by_replyId_and_fingerprint", (q) =>
          q.eq("replyId", args.replyId).eq("fingerprint", args.fingerprint)
        )
        .unique();

      if (existing) {
        if (normalizeReactionType(existing.type) === type) {
          await ctx.db.delete(existing._id);
          return { action: "removed" };
        } else {
          await ctx.db.patch(existing._id, {
            type,
            createdAt: Date.now(),
          });
          return { action: "updated" };
        }
      }

      await ctx.db.insert("reactions", {
        replyId: args.replyId,
        type,
        fingerprint: args.fingerprint,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }
  },
});

export const getCounts = query({
  args: {
    confessionId: v.optional(v.id("confessions")),
    replyId: v.optional(v.id("replies")),
    fingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.confessionId && !args.replyId) {
      return {
        counts: {} as Record<string, number>,
        userReaction: null as string | null,
      };
    }

    const reactions = args.confessionId
      ? await ctx.db
          .query("reactions")
          .withIndex("by_confessionId", (q) =>
            q.eq("confessionId", args.confessionId)
          )
          .collect()
      : await ctx.db
          .query("reactions")
          .withIndex("by_replyId", (q) => q.eq("replyId", args.replyId))
          .collect();

    const counts: Record<string, number> = {};
    let userReaction: string | null = null;

    reactions.forEach((r) => {
      const unified = normalizeReactionType(r.type);
      counts[unified] = (counts[unified] || 0) + 1;
      if (args.fingerprint && r.fingerprint === args.fingerprint) {
        userReaction = unified;
      }
    });

    return {
      counts,
      userReaction,
    };
  },
});
