import { testCoverageAnalyzerPrompt } from '../prompts/test-coverage-analyzer.prompt';

export const testCoverageAnalyzer = {
  description:
    'Analyzes test coverage gaps and recommends missing test cases.',

  prompt: testCoverageAnalyzerPrompt,

  model: 'inherit',

  tools: [
    'Read',
    'Grep',
    'Glob'
  ]
};