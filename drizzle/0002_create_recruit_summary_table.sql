CREATE TYPE "public"."recruit_context" AS ENUM('outreach-event-feedback', 'interview-feedback', 'admin-notes', 'counselor-notes');--> statement-breakpoint
CREATE TABLE "recruit_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"recruit_id" integer NOT NULL,
	"ai_summary_id" uuid NOT NULL,
	"context" "recruit_context" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recruit_summary" ADD CONSTRAINT "recruit_summary_recruit_id_recruit_id_fk" FOREIGN KEY ("recruit_id") REFERENCES "public"."recruit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruit_summary" ADD CONSTRAINT "recruit_summary_ai_summary_id_ai_summary_id_fk" FOREIGN KEY ("ai_summary_id") REFERENCES "public"."ai_summary"("id") ON DELETE cascade ON UPDATE no action;