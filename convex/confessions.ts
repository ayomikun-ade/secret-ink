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

    const eightHoursFromNow = Date.now() + 8 * 60 * 60 * 1000;
    const expiresAt = board.expiresAt 
      ? Math.min(board.expiresAt, eightHoursFromNow)
      : eightHoursFromNow;

    const confessionId = await ctx.db.insert("confessions", {
      boardId: args.boardId,
      content: args.content,
      nickname: args.nickname,
      fingerprint: args.fingerprint,
      createdAt: Date.now(),
      expiresAt: expiresAt,
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

    return confessions.filter((c) => !c.expiresAt || c.expiresAt > Date.now());
  },
});
