export const SUMMARY_CONTEXTS = [
  "admin_notes",
  "counselor_notes",
] as const;

export type SummaryContext = (typeof SUMMARY_CONTEXTS)[number];

export const SUMMARY_TO_RECRUIT_CONTEXT: Partial<Record<SummaryContext, "admin-notes" | "counselor-notes">> =
  {
    admin_notes: "admin-notes",
    counselor_notes: "counselor-notes",
  } as const;