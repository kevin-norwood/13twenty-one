import { pgTable, uuid, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { aiSummary } from "./aiSummary";

export const recruitContext = pgEnum("recruit_context", [
  "outreach-event-feedback",
  "interview-feedback",
  "admin-notes",
  "counselor-notes",
]);

export const recruitSummary = pgTable("recruit_summary", {
  id: uuid("id").primaryKey().defaultRandom(), 
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // nullable by default
  recruitId: integer("recruit_id").notNull(),
  aiSummaryId: uuid("ai_summary_id").notNull().references(() => aiSummary.id, { onDelete: "cascade" }),
  context: recruitContext("context").notNull(),
});
