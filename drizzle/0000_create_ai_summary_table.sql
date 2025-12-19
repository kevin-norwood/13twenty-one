CREATE TYPE "public"."ai_summary_status" AS ENUM('requested', 'in-progress', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "ai_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"request" jsonb,
	"status" "ai_summary_status" DEFAULT 'requested' NOT NULL,
	"summary_text" text
);
