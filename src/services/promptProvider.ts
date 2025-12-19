/**
 * PromptProvider interface for fetching prompts from various sources.
 * This abstraction allows easy migration from code-based prompts to S3 or other sources.
 */

export enum PromptType {
  SUMMARIZER = 'summarizer',
  // Add more prompt types as needed
}

export interface PromptProvider {
  /**
   * Retrieves a prompt by type
   * @param type The type of prompt to retrieve
   * @returns The prompt content as a string
   */
  getPrompt(type: PromptType | string): Promise<string>;
}
