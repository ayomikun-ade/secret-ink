import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const cleanupExpired = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Clean up expired boards
    const expiredBoards = await ctx.db
      .query("boards")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .collect();

    for (const board of expiredBoards) {
      const confessions = await ctx.db
        .query("confessions")
        .withIndex("by_boardId", (q) => q.eq("boardId", board._id))
        .collect();

      for (const confession of confessions) {
        const replies = await ctx.db
          .query("replies")
          .withIndex("by_confessionId", (q) => q.eq("confessionId", confession._id))
          .collect();
        for (const reply of replies) {
          const replyReactions = await ctx.db
            .query("reactions")
            .withIndex("by_replyId", (q) => q.eq("replyId", reply._id))
            .collect();
          for (const reaction of replyReactions) {
            await ctx.db.delete(reaction._id);
          }
          await ctx.db.delete(reply._id);
        }

        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_confessionId", (q) => q.eq("confessionId", confession._id))
          .collect();
        for (const reaction of reactions) {
          await ctx.db.delete(reaction._id);
        }
        await ctx.db.delete(confession._id);
      }
      await ctx.db.delete(board._id);
    }

    // Clean up expired confessions (that might not have been caught by board cleanup)
    const expiredConfessions = await ctx.db
      .query("confessions")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .collect();

    for (const confession of expiredConfessions) {
      const replies = await ctx.db
        .query("replies")
        .withIndex("by_confessionId", (q) => q.eq("confessionId", confession._id))
        .collect();
      for (const reply of replies) {
        const replyReactions = await ctx.db
          .query("reactions")
          .withIndex("by_replyId", (q) => q.eq("replyId", reply._id))
          .collect();
        for (const reaction of replyReactions) {
          await ctx.db.delete(reaction._id);
        }
        await ctx.db.delete(reply._id);
      }

      const reactions = await ctx.db
        .query("reactions")
        .withIndex("by_confessionId", (q) => q.eq("confessionId", confession._id))
        .collect();
      for (const reaction of reactions) {
        await ctx.db.delete(reaction._id);
      }
      await ctx.db.delete(confession._id);
    }
  },
});

const crons = cronJobs();

crons.interval(
  "cleanup expired boards and confessions",
  { hours: 1 },
  internal.crons.cleanupExpired
);

export default crons;
