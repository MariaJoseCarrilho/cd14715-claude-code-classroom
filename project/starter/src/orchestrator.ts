import { query } from '@anthropic-ai/claude-agent-sdk';

import {
  codeQualityAnalyzer,
  testCoverageAnalyzer,
  refactoringSuggester
} from './agents/index.js';

import { mcpServersConfig } from './config/mcp.config.js';
import { orchestratorPrompt } from './prompts/orchestrator.prompt.js';

import {
  ReviewReportSchema,
  ReviewReportJSONSchema
} from './types/report-types.js';

import type { ReviewReport } from './types/report-types.js';

export interface OrchestratorOptions {
  model?: string;
  maxTurns?: number;
}

export class CodeReviewOrchestrator {
  private readonly model: string;
  private readonly maxTurns: number;

  constructor(options: OrchestratorOptions = {}) {
    const configuredModel =
      options.model ?? process.env.ANTHROPIC_MODEL;

    if (!configuredModel) {
      throw new Error(
        'ANTHROPIC_MODEL is required. Configure it in the environment.'
      );
    }

    this.model = configuredModel;
    this.maxTurns = options.maxTurns ?? 30;
  }

  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    if (!owner.trim()) {
      throw new Error('Repository owner is required.');
    }

    if (!repo.trim()) {
      throw new Error('Repository name is required.');
    }

    if (!Number.isInteger(prNumber) || prNumber <= 0) {
      throw new Error('PR number must be a positive integer.');
    }

    const startedAt = Date.now();

    const prompt = `
${orchestratorPrompt}

Pull request to review:

Owner: ${owner}
Repository: ${repo}
Pull request number: ${prNumber}

Use the GitHub MCP server to fetch this exact pull request.
Invoke all three registered specialist agents.
Set metadata.duration to the elapsed review duration in milliseconds.
`;

    let structuredOutput: unknown;

const result = query({
  prompt,
  options: {
    pathToClaudeCodeExecutable: '/usr/local/bin/claude',

    env: {
      ...process.env,
      PATH: [
        '/usr/local/bin',
        '/usr/bin',
        '/bin',
        process.env.PATH ?? ''
      ].join(':')
    },

    model: this.model,
    maxTurns: this.maxTurns,

    cwd:
      process.env.PROJECT_ROOT ??
      process.cwd(),

    permissionMode: 'bypassPermissions',

    allowedTools: [
      'Task',
      'Read',
      'Grep',
      'Glob',
      'Skill',
      'mcp__github__pull_request_read',
      'mcp__eslint__lint'
    ],

    agents: {
      'code-quality-analyzer': codeQualityAnalyzer,
      'test-coverage-analyzer': testCoverageAnalyzer,
      'refactoring-suggester': refactoringSuggester
    },

    mcpServers: mcpServersConfig,

    outputFormat: {
      type: 'json_schema',
      schema: ReviewReportJSONSchema
    }
  }
});

    for await (const message of result) {
      if (
        message.type === 'result' &&
        'structured_output' in message &&
        message.structured_output
      ) {
        structuredOutput = message.structured_output;
      }
    }

    if (!structuredOutput) {
      throw new Error(
        'The Claude Agent SDK completed without returning structured output.'
      );
    }

    const validation =
      ReviewReportSchema.safeParse(structuredOutput);

    if (!validation.success) {
      const details = validation.error.issues
        .map(issue => {
          const location = issue.path.join('.');
          return `${location || 'root'}: ${issue.message}`;
        })
        .join('; ');

      throw new Error(
        `The generated review report failed schema validation: ${details}`
      );
    }

    return {
      ...validation.data,
      metadata: {
        ...validation.data.metadata,
        duration: Date.now() - startedAt
      }
    };
  }
}