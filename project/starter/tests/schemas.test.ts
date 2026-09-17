import { describe, expect, it } from 'vitest';

import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema,
  CodeQualityResultJSONSchema,
  TestCoverageResultJSONSchema,
  RefactoringSuggestionJSONSchema
} from '../src/types/analysis-results';

import {
  ReviewReportSchema,
  ReviewReportJSONSchema
} from '../src/types/report-types';

describe('Schemas', () => {
  it('should validate a valid CodeQualityResult', () => {
    expect(() =>
      CodeQualityResultSchema.parse({
        file: 'app.ts',
        issues: [],
        overallScore: 100,
        summary: 'No issues'
      })
    ).not.toThrow();
  });

  it('should reject invalid CodeQualityResult', () => {
    expect(() =>
      CodeQualityResultSchema.parse({
        file: 'app.ts',
        issues: [],
        overallScore: 101,
        summary: 'Invalid'
      })
    ).toThrow();
  });

  it('should validate boundary values', () => {
    expect(() =>
      CodeQualityResultSchema.parse({
        file: 'app.ts',
        issues: [],
        overallScore: 0,
        summary: 'Minimum'
      })
    ).not.toThrow();

    expect(() =>
      CodeQualityResultSchema.parse({
        file: 'app.ts',
        issues: [],
        overallScore: 100,
        summary: 'Maximum'
      })
    ).not.toThrow();
  });

  it('should validate TestCoverageResult', () => {
    expect(() =>
      TestCoverageResultSchema.parse({
        file: 'app.ts',
        hasTests: true,
        testFiles: [],
        untestedPaths: [],
        coverageEstimate: 100,
        summary: 'Covered'
      })
    ).not.toThrow();
  });

  it('should validate RefactoringSuggestion', () => {
    expect(() =>
      RefactoringSuggestionSchema.parse({
        file: 'app.ts',
        suggestions: [],
        summary: 'No refactoring needed'
      })
    ).not.toThrow();
  });

  it('should validate ReviewReport', () => {
    expect(() =>
      ReviewReportSchema.parse({
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 0,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 0,
          agentVersions: {
            orchestrator: '1.0.0'
          }
        }
      })
    ).not.toThrow();
  });

  it('should export JSON schemas', () => {
    expect(CodeQualityResultJSONSchema).toBeDefined();
    expect(TestCoverageResultJSONSchema).toBeDefined();
    expect(RefactoringSuggestionJSONSchema).toBeDefined();
    expect(ReviewReportJSONSchema).toBeDefined();

    expect(typeof CodeQualityResultJSONSchema).toBe('object');
    expect(typeof ReviewReportJSONSchema).toBe('object');
  });
});