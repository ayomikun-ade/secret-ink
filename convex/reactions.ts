import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggle = mutation({
  args: {
    confessionId: v.id("confessions"),
    type: v.union(
      v.literal("love"),
      v.literal("laugh"),
      v.literal("shock"),
      v.literal("sad")
    ),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.confessionId);
    if (!confession) throw new Error("Confession not found");
    if (confession.expiresAt && confession.expiresAt < Date.now()) {
      throw new Error("Confession has expired");
    }

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_confessionId_and_fingerprint", (q) =>
        q.eq("confessionId", args.confessionId).eq("fingerprint", args.fingerprint)
      )
      .unique();

    if (existing) {
      if (existing.type === args.type) {
        // If it's the same type, remove it (toggle off)
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      } else {
        // If it's a different type, update it
        await ctx.db.patch(existing._id, { type: args.type, createdAt: Date.now() });
        return { action: "updated" };
      }
    }

    // Otherwise, insert new
    await ctx.db.insert("reactions", {
      confessionId: args.confessionId,
      type: args.type,
      fingerprint: args.fingerprint,
      createdAt: Date.now(),
    });
    return { action: "added" };
  },
});

export const getCounts = query({
  args: { confessionId: v.id("confessions") },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_confessionId", (q) => q.eq("confessionId", args.confessionId))
      .collect();

    const counts = {
      love: 0,
      laugh: 0,
      shock: 0,
      sad: 0,
    };

    reactions.forEach((r) => {
      counts[r.type]++;
    });

    return counts;
  },
});
