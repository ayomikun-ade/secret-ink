import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    boardId: v.id("boards"),
    content: v.string(),
    nickname: v.optional(v.string()),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.content.length === 0) throw new Error("Content cannot be empty");
    if (args.content.length > 300) throw new Error("Content too long (max 300 characters)");

    // Basic Rate Limiting: 5 per hour per fingerprint
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentConfessions = await ctx.db
      .query("confessions")
      .withIndex("by_fingerprint_and_createdAt", (q) =>
        q.eq("fingerprint", args.fingerprint).gte("createdAt", oneHourAgo)
      )
      .collect();

    if (recentConfessions.length >= 5) {
      throw new Error("Rate limit exceeded. Try again in an hour.");
    }

    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");
    if (board.isLocked) throw new Error("Board is locked");
    if (board.expiresAt && board.expiresAt < Date.now()) {
      throw new Error("Board has expired");
    }

    const confessionId = await ctx.db.insert("confessions", {
      boardId: args.boardId,
      content: args.content,
      nickname: args.nickname,
      fingerprint: args.fingerprint,
      createdAt: Date.now(),
      expiresAt: board.expiresAt,
    });

    return confessionId;
  },
});

export const list = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const confessions = await ctx.db
      .query("confessions")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();

    const active = confessions.filter(
      (c) => !c.expiresAt || c.expiresAt > Date.now()
    );

    const replies = await ctx.db
      .query("replies")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();

    const replyCountByConfession: Record<string, number> = {};
    for (const r of replies) {
      replyCountByConfession[r.confessionId] =
        (replyCountByConfession[r.confessionId] || 0) + 1;
    }

    return await Promise.all(
      active.map(async (confession) => {
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_confessionId", (q) =>
            q.eq("confessionId", confession._id)
          )
          .collect();

        return {
          ...confession,
          reactionCount: reactions.length,
          replyCount: replyCountByConfession[confession._id] || 0,
        };
      })
    );
  },
});

export const getById = query({
  args: { confessionId: v.id("confessions") },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.confessionId);
    if (!confession) return null;
    if (confession.expiresAt && confession.expiresAt < Date.now()) {
      return null;
    }
    return confession;
  },
});

const SELF_DELETE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export const remove = mutation({
  args: {
    confessionId: v.id("confessions"),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.confessionId);
    if (!confession) throw new Error("Post not found");
    if (confession.fingerprint !== args.fingerprint) {
      throw new Error("You can only delete your own post");
    }
    if (Date.now() - confession.createdAt > SELF_DELETE_WINDOW_MS) {
      throw new Error("Delete window (5 minutes) has expired");
    }

    // Cascade delete replies and their reactions
    const replies = await ctx.db
      .query("replies")
      .withIndex("by_confessionId", (q) =>
        q.eq("confessionId", confession._id)
      )
      .collect();

    for (const reply of replies) {
      const replyReactions = await ctx.db
        .query("reactions")
        .withIndex("by_replyId", (q) => q.eq("replyId", reply._id))
        .collect();
      for (const r of replyReactions) {
        await ctx.db.delete(r._id);
      }
      await ctx.db.delete(reply._id);
    }

    // Delete confession reactions
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_confessionId", (q) =>
        q.eq("confessionId", confession._id)
      )
      .collect();
    for (const r of reactions) {
      await ctx.db.delete(r._id);
    }

    await ctx.db.delete(confession._id);
    return { deleted: true };
  },
});
