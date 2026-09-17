import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { codeQualityAnalyzerPrompt } from '../prompts/code-quality-analyzer.prompt.js';

export const codeQualityAnalyzer: AgentDefinition = {
  description:
    'Reviews pull request files for security vulnerabilities, performance issues, bug risks, maintainability problems, and JavaScript best-practice violations.',
  prompt: codeQualityAnalyzerPrompt,
  model: 'inherit',
  tools: ['Read', 'Grep', 'Glob', 'Skill']
};