import path from "path";
import {Anthropic} from "@anthropic-ai/sdk";
import {APIKeyHelper} from "@/app/claude/api-key-helper";

// export const MODEL = "claude-sonnet-4-5-20250929";
export const MODEL = "claude-sonnet-4-20250514";
let clientPromise : Promise<Anthropic> | null = null;

export function getClaude(): Promise<Anthropic> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        throw new Error("Missing ANTHROPIC_API_KEY environment variable");
      }

      return new Anthropic({ apiKey });
    })();
  }

  return clientPromise;
}