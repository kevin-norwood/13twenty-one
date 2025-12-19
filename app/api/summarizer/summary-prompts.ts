// src/lib/ai/summary-prompts.ts
import type { SummaryContext } from "./summary-context";

type PromptArgs = {
  payload: unknown;
};

export const SUMMARY_PROMPTS: Record<
  SummaryContext,
  (args: PromptArgs) => string
> = {
  admin_notes: ({ payload }) => {
    return `
You are summarizing internal recruiting notes written by law firm recruiting administrators.

These notes may include:
- Evaluations of a law candidate
- Interview feedback
- Observations about professionalism, skills, or concerns

If present, \`userFName\` and \`userLName\` refer to the administrator who wrote the note, NOT the candidate.

Write a concise, professional summary that:
- Synthesizes key themes and signals
- Highlights strengths and concerns
- Avoids speculation or invented facts
- Uses neutral, objective language

Notes:
${JSON.stringify(payload, null, 2)}
`.trim();
  },

  counselor_notes: ({ payload }) => {
    return `
You are summarizing notes written by law school career services counselors about a law student.

These notes may include:
- Career guidance
- Academic or professional observations
- Recommendations or cautions

Write a concise summary that:
- Focuses on actionable insights
- Highlights strengths, risks, and counselor guidance
- Uses supportive, professional language
- Does NOT restate raw data verbatim

Notes:
${JSON.stringify(payload, null, 2)}
`.trim();
  },
};
