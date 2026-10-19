import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggle = mutation({
  args: {
    confessionId: v.optional(v.id("confessions")),
    replyId: v.optional(v.id("replies")),
    type: v.union(
      v.literal("love"),
      v.literal("laugh"),
      v.literal("shock"),
      v.literal("sad")
    ),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.confessionId && !args.replyId) {
      throw new Error("Either confessionId or replyId must be provided");
    }

    if (args.confessionId) {
      const confession = await ctx.db.get(args.confessionId);
      if (!confession) throw new Error("Confession not found");
      if (confession.expiresAt && confession.expiresAt < Date.now()) {
        throw new Error("Confession has expired");
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
        if (existing.type === args.type) {
          await ctx.db.delete(existing._id);
          return { action: "removed" };
        } else {
          await ctx.db.patch(existing._id, {
            type: args.type,
            createdAt: Date.now(),
          });
          return { action: "updated" };
        }
      }

      await ctx.db.insert("reactions", {
        confessionId: args.confessionId,
        type: args.type,
        fingerprint: args.fingerprint,
        createdAt: Date.now(),
      });
      return { action: "added" };
    }

    if (args.replyId) {
      const reply = await ctx.db.get(args.replyId);
      if (!reply) throw new Error("Reply not found");

      const confession = await ctx.db.get(reply.confessionId);
      if (!confession || (confession.expiresAt && confession.expiresAt < Date.now())) {
        throw new Error("Parent confession has expired");
      }

      const existing = await ctx.db
        .query("reactions")
        .withIndex("by_replyId_and_fingerprint", (q) =>
          q.eq("replyId", args.replyId).eq("fingerprint", args.fingerprint)
        )
        .unique();

      if (existing) {
        if (existing.type === args.type) {
          await ctx.db.delete(existing._id);
          return { action: "removed" };
        } else {
          await ctx.db.patch(existing._id, {
            type: args.type,
            createdAt: Date.now(),
          });
          return { action: "updated" };
        }
      }

      await ctx.db.insert("reactions", {
        replyId: args.replyId,
        type: args.type,
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
    const counts = {
      love: 0,
      laugh: 0,
      shock: 0,
      sad: 0,
    };

    if (!args.confessionId && !args.replyId) {
      return {
        ...counts,
        userReaction: null as "love" | "laugh" | "shock" | "sad" | null,
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

    let userReaction: "love" | "laugh" | "shock" | "sad" | null = null;

    reactions.forEach((r) => {
      counts[r.type]++;
      if (args.fingerprint && r.fingerprint === args.fingerprint) {
        userReaction = r.type;
      }
    });

    return {
      ...counts,
      userReaction,
    };
  },
});
