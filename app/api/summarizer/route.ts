import { NextResponse } from "next/server";
import { db } from "@/src/db"; // your drizzle db instance
import { aiSummary } from "@/src/db/schema/aiSummary";
import { and, eq, isNull } from "drizzle-orm";
import { recruitSummary } from "@/src/db/schema/recruitSummary";
import { getClaude, MODEL } from "@/app/claude/client"; // adjust path if needed
import {
    SUMMARY_CONTEXTS,
    type SummaryContext,
    SUMMARY_TO_RECRUIT_CONTEXT
} from "@/app/api/summarizer/summary-context";
import { SUMMARY_PROMPTS } from "@/app/api/summarizer/summary-prompts";

type SummaryRequest = {
    context: SummaryContext;
    payload: unknown;
};

function isJsonObjectOrArray(v: unknown): boolean {
    return typeof v === "object" && v !== null;
}

function getRecruitIdFromPayload(payload: unknown): number | null {
    if (typeof payload !== "object" || payload === null) return null;
    const v = (payload as any).recruitId;
    return Number.isInteger(v) ? v : null;
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Partial<SummaryRequest>;

        if (
            typeof body?.context !== "string" ||
            !SUMMARY_CONTEXTS.includes(body.context as SummaryContext)
        ) {
            return NextResponse.json(
                { error: "Invalid or unsupported context" },
                { status: 400 }
            );
        }

        if (!("payload" in (body ?? {})) || !isJsonObjectOrArray(body.payload)) {
            return NextResponse.json(
                { error: "Missing or invalid payload (must be JSON object or array)" },
                { status: 400 }
            );
        }

        const context = body.context as SummaryContext;

        // If this context should create recruit_summary, require recruitId
        const recruitContext = SUMMARY_TO_RECRUIT_CONTEXT[context];
        const recruitId = recruitContext ? getRecruitIdFromPayload(body.payload) : null;

        if (recruitContext && recruitId === null) {
            return NextResponse.json(
                { error: "payload.recruitId (integer) is required for this context" },
                { status: 400 }
            );
        }

        const prompt = SUMMARY_PROMPTS[context]({ payload: body.payload });

        const claude = await getClaude();
        const response = await claude.messages.create({
            model: MODEL,
            max_tokens: 512,
            messages: [{ role: "user", content: prompt }],
        });

        const summaryText = response.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("\n");

        const result = await db.transaction(async (tx) => {
            const [aiRow] = await tx
                .insert(aiSummary)
                .values({
                    request: { context, payload: body.payload },
                    status: "completed",
                    summaryText,
                    updatedAt: new Date(),
                })
                .returning({ id: aiSummary.id });

            if (recruitContext && recruitId !== null) {
                // Soft-delete any existing "active" recruit_summary for same (recruitId, context)
                await tx
                    .update(recruitSummary)
                    .set({
                        deletedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(recruitSummary.recruitId, recruitId),
                            eq(recruitSummary.context, recruitContext),
                            isNull(recruitSummary.deletedAt)
                        )
                    );

                // Insert the new recruit_summary row
                await tx.insert(recruitSummary).values({
                    recruitId,
                    aiSummaryId: aiRow.id,
                    context: recruitContext,
                    updatedAt: new Date(),
                });
            }

            return aiRow;
        });

        return NextResponse.json({ id: result.id, summary: summaryText }, { headers: {'Access-Control-Allow-Origin': '*'}});
    } catch (err) {
        console.error("Summarizer error:", err);
        return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
    }
}