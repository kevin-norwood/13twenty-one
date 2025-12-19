import { pgTable, uuid, timestamp, jsonb, text, pgEnum } from "drizzle-orm/pg-core";

export const aiSummaryStatus = pgEnum("ai_summary_status", [
  "requested",
  "in-progress",
  "completed",
  "failed",
]);

export const aiSummary = pgTable("ai_summary", {
  id: uuid("id").primaryKey().defaultRandom(), 
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // nullable by default
  request: jsonb("request"),
  status: aiSummaryStatus("status").default("requested").notNull(),
  summaryText: text("summary_text"),
});
