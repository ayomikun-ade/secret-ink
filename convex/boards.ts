import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    theme: v.optional(
      v.union(
        v.literal("indigo"),
        v.literal("teal"),
        v.literal("amber"),
        v.literal("red"),
        v.literal("purple"),
        v.literal("emerald"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const minExpiry = now + 1 * 60 * 60 * 1000; // 1 hour from now
    const maxExpiry = now + 14 * 24 * 60 * 60 * 1000; // 14 days from now
    const defaultExpiry = now + 12 * 60 * 60 * 1000; // 12 hours from now

    // Validate expiry if provided
    const expiresAt = args.expiresAt ?? defaultExpiry;
    if (args.expiresAt) {
      if (args.expiresAt < minExpiry) {
        throw new Error("Board expiry must be at least 1 hour from now");
      }
      if (args.expiresAt > maxExpiry) {
        throw new Error("Board expiry cannot exceed 14 days from now");
      }
    }

    const slug = nanoid(10);
    const ownerToken = nanoid(32);
    const boardId = await ctx.db.insert("boards", {
      name: args.name,
      slug,
      description: args.description,
      createdAt: now,
      expiresAt,
      ownerToken,
      isLocked: false,
      theme: args.theme ?? "indigo",
    });
    return { boardId, slug };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const board = await ctx.db
      .query("boards")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!board) return null;

    if (board.expiresAt && board.expiresAt < Date.now()) {
      return null;
    }

    // Filter out internal fields
    const { ownerToken: _, ...publicBoard } = board;
    return publicBoard;
  },
});
