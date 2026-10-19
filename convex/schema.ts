import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    ownerToken: v.string(),
    isLocked: v.boolean(),
    theme: v.optional(v.union(
      v.literal("indigo"),
      v.literal("teal"),
      v.literal("amber"),
      v.literal("red"),
      v.literal("purple"),
      v.literal("emerald")
    )),
    allowReplies: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_expiresAt", ["expiresAt"]),

  confessions: defineTable({
    boardId: v.id("boards"),
    content: v.string(),
    nickname: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    fingerprint: v.string(),
  })
    .index("by_boardId", ["boardId"])
    .index("by_expiresAt", ["expiresAt"])
    .index("by_fingerprint_and_createdAt", ["fingerprint", "createdAt"]),

  replies: defineTable({
    confessionId: v.id("confessions"),
    boardId: v.id("boards"),
    content: v.string(),
    nickname: v.optional(v.string()),
    fingerprint: v.string(),
    createdAt: v.number(),
  })
    .index("by_confessionId", ["confessionId"])
    .index("by_boardId", ["boardId"])
    .index("by_fingerprint_and_createdAt", ["fingerprint", "createdAt"]),

  reactions: defineTable({
    confessionId: v.optional(v.id("confessions")),
    replyId: v.optional(v.id("replies")),
    type: v.union(
      v.literal("love"),
      v.literal("laugh"),
      v.literal("shock"),
      v.literal("sad")
    ),
    fingerprint: v.string(),
    createdAt: v.number(),
  })
    .index("by_confessionId", ["confessionId"])
    .index("by_confessionId_and_fingerprint", ["confessionId", "fingerprint"])
    .index("by_replyId", ["replyId"])
    .index("by_replyId_and_fingerprint", ["replyId", "fingerprint"]),
});
