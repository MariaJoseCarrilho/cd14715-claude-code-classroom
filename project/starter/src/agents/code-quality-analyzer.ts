import { codeQualityAnalyzerPrompt } from '../prompts/code-quality-analyzer.prompt';

export const codeQualityAnalyzer = {
  description:
    'Analyzes code quality, security, performance and maintainability issues.',

  prompt: codeQualityAnalyzerPrompt,

  model: 'inherit',

  tools: [
    'Read',
    'Grep',
    'Glob',
    'Skill'
  ]
};