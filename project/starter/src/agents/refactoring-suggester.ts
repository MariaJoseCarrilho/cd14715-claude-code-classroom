import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { refactoringSuggesterPrompt } from '../prompts/refactoring-suggester.prompt.js';

export const refactoringSuggester: AgentDefinition = {
  description:
    'Identifies safe refactoring, modernization, simplification, naming, and design-pattern improvements in pull request files.',
  prompt: refactoringSuggesterPrompt,
  model: 'inherit',
  tools: ['Read', 'Grep', 'Glob', 'Skill']
};