/**
 * Centralized prompt exports
 * Maps prompt types to their content
 */

import { SUMMARIZER_PROMPT } from './summarizer';

export const summarizer = SUMMARIZER_PROMPT;

// Export all prompts as a record for dynamic access
export default {
  summarizer,
};
