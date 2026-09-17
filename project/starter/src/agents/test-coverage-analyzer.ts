import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { testCoverageAnalyzerPrompt } from '../prompts/test-coverage-analyzer.prompt.js';

export const testCoverageAnalyzer: AgentDefinition = {
  description:
    'Examines source and test files to identify missing assertions, untested branches, edge cases, and actionable test coverage gaps.',
  prompt: testCoverageAnalyzerPrompt,
  model: 'inherit',
  tools: ['Read', 'Grep', 'Glob', 'Skill']
};