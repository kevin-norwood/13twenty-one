import { CodePromptProvider } from '../codePromptProvider';
import { PromptType } from '../promptProvider';

describe('CodePromptProvider', () => {
  let provider: CodePromptProvider;

  beforeEach(() => {
    provider = new CodePromptProvider();
  });

  describe('getPrompt()', () => {
    it('retrieves a valid prompt by PromptType enum', async () => {
      const prompt = await provider.getPrompt(PromptType.SUMMARIZER);
      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('throws error when prompt type does not exist', async () => {
      await expect(provider.getPrompt('invalid_prompt_type')).rejects.toThrow(
        'Prompt type not found: invalid_prompt_type'
      );
    });
  });
});
