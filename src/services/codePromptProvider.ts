import { PromptProvider, PromptType } from './promptProvider';
import * as prompts from '../prompts';

/**
 * CodePromptProvider loads prompts from code (co-located files).
 * This is the initial implementation. Can be swapped for S3PromptProvider
 * without changing dependent code.
 */
export class CodePromptProvider implements PromptProvider {
  async getPrompt(type: PromptType | string): Promise<string> {
    const promptKey = type.toLowerCase();

    if (!(promptKey in prompts)) {
      throw new Error(`Prompt type not found: ${type}`);
    }

    // Return the prompt content
    return (prompts as Record<string, string>)[promptKey];
  }
}

// Singleton instance
export const promptProvider = new CodePromptProvider();
