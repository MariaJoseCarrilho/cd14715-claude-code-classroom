import { refactoringSuggesterPrompt } from '../prompts/refactoring-suggester.prompt';

export const refactoringSuggester = {
  description:
    'Suggests refactoring opportunities, modernization improvements and cleaner architecture.',

  prompt: refactoringSuggesterPrompt,

  model: 'inherit',

  tools: [
    'Read',
    'Grep',
    'Glob'
  ]
};