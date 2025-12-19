import { PromptProvider, PromptType } from "@/src/services/promptProvider";
import PROMPTS from "@/src/prompts";

export class CodePromptProvider implements PromptProvider {
  async getPrompt(type: PromptType | string): Promise<string> {
    const promptKey = type.toLowerCase();

    if (!(promptKey in PROMPTS)) {
      throw new Error(`Prompt type not found: ${type}`);
    }

    return PROMPTS[promptKey as keyof typeof PROMPTS];
  }
}

export const promptProvider = new CodePromptProvider();