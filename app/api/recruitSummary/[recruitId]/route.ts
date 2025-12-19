import { NextResponse } from "next/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/src/db";
import { recruitSummary } from "@/src/db/schema/recruitSummary";
import { aiSummary } from "@/src/db/schema/aiSummary";
import { SUMMARY_CONTEXTS, type SummaryContext, SUMMARY_TO_RECRUIT_CONTEXT } from "@/app/api/summarizer/summary-context";

function parseRecruitId(v: string): number | null {
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

async function readContext(req: Request): Promise<SummaryContext | null> {
  const url = new URL(req.url);
  const qs = url.searchParams.get("context");
  if (qs && SUMMARY_CONTEXTS.includes(qs as SummaryContext)) {
    return qs as SummaryContext;
  }

  // optional fallback: body (safe to ignore failures)
  try {
    const body = await req.json();
    if (
      typeof body?.context === "string" &&
      SUMMARY_CONTEXTS.includes(body.context as SummaryContext)
    ) {
      return body.context as SummaryContext;
    }
  } catch {}

  return null;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ recruitId: string }> }
) {
  const { recruitId: rawRecruitId } = await params;
  const recruitId = parseRecruitId(rawRecruitId);

  // Soft-fail: invalid recruitId
  if (recruitId === null) {
    return NextResponse.json({ data: null });
  }

  const context = await readContext(req);
  if (!context) {
    return NextResponse.json({ data: null });
  }

  const recruitContext = SUMMARY_TO_RECRUIT_CONTEXT[context];
  if (!recruitContext) {
    return NextResponse.json({ data: null });
  }

  const rows = await db
    .select({
      recruitId: recruitSummary.recruitId,
      context: recruitSummary.context,
      aiSummaryId: recruitSummary.aiSummaryId,
      summaryText: aiSummary.summaryText,
      status: aiSummary.status,
      updatedAt: aiSummary.updatedAt,
    })
    .from(recruitSummary)
    .innerJoin(aiSummary, eq(recruitSummary.aiSummaryId, aiSummary.id))
    .where(
      and(
        eq(recruitSummary.recruitId, recruitId),
        eq(recruitSummary.context, recruitContext),
        isNull(recruitSummary.deletedAt),
        isNull(aiSummary.deletedAt)
      )
    )
    .orderBy(desc(recruitSummary.createdAt))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ data: null }, { headers: {'Access-Control-Allow-Origin': '*'}});
  }

  return NextResponse.json({
    data: {
      recruitId: rows[0].recruitId,
      context, // API context (snake_case)
      summaryText: rows[0].summaryText,
      status: rows[0].status,
      updatedAt: rows[0].updatedAt,
    },
  }, { headers: {'Access-Control-Allow-Origin': '*'}});
}