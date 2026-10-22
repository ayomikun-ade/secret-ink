import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    confessionId: v.id("confessions"),
    content: v.string(),
    nickname: v.optional(v.string()),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmed = args.content.trim();
    if (trimmed.length === 0) throw new Error("Reply cannot be empty");
    if (args.content.length > 250) {
      throw new Error("Reply too long (max 250 characters)");
    }

    // Rate limiting: 15 replies per hour per fingerprint
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentReplies = await ctx.db
      .query("replies")
      .withIndex("by_fingerprint_and_createdAt", (q) =>
        q.eq("fingerprint", args.fingerprint).gte("createdAt", oneHourAgo)
      )
      .collect();

    if (recentReplies.length >= 15) {
      throw new Error("Rate limit exceeded. Try again in an hour.");
    }

    const confession = await ctx.db.get(args.confessionId);
    if (!confession) throw new Error("Post not found");
    if (confession.expiresAt && confession.expiresAt < Date.now()) {
      throw new Error("Post has expired");
    }

    const board = await ctx.db.get(confession.boardId);
    if (!board) throw new Error("Board not found");
    if (board.isLocked) throw new Error("Board is locked");
    if (board.expiresAt && board.expiresAt < Date.now()) {
      throw new Error("Board has expired");
    }
    if (board.allowReplies === false) {
      throw new Error("Replies are disabled for this board");
    }

    const replyId = await ctx.db.insert("replies", {
      confessionId: args.confessionId,
      boardId: confession.boardId,
      content: args.content,
      nickname: args.nickname,
      fingerprint: args.fingerprint,
      createdAt: Date.now(),
    });

    return replyId;
  },
});

export const listByConfession = query({
  args: {
    confessionId: v.id("confessions"),
    fingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.confessionId);
    if (!confession) return [];

    const replies = await ctx.db
      .query("replies")
      .withIndex("by_confessionId", (q) =>
        q.eq("confessionId", args.confessionId)
      )
      .order("asc")
      .collect();

    return replies.map(({ fingerprint, ...reply }) => ({
      ...reply,
      isAuthor: fingerprint === confession.fingerprint,
      isViewer: Boolean(args.fingerprint && fingerprint === args.fingerprint),
    }));
  },
});

export const getCount = query({
  args: { confessionId: v.id("confessions") },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("replies")
      .withIndex("by_confessionId", (q) =>
        q.eq("confessionId", args.confessionId)
      )
      .collect();

    return replies.length;
  },
});

const SELF_DELETE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export const remove = mutation({
  args: {
    replyId: v.id("replies"),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const reply = await ctx.db.get(args.replyId);
    if (!reply) throw new Error("Reply not found");
    if (reply.fingerprint !== args.fingerprint) {
      throw new Error("You can only delete your own reply");
    }
    if (Date.now() - reply.createdAt > SELF_DELETE_WINDOW_MS) {
      throw new Error("Delete window (5 minutes) has expired");
    }

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_replyId", (q) => q.eq("replyId", reply._id))
      .collect();

    for (const r of reactions) {
      await ctx.db.delete(r._id);
    }

    await ctx.db.delete(reply._id);
    return { deleted: true };
  },
});
