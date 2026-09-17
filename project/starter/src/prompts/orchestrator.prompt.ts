export const orchestratorPrompt = `
Review the supplied pull request.

Workflow:

1. Retrieve pull request information.

2. Use the code-quality-analyzer agent to review:
   - security
   - maintainability
   - performance

3. Use the test-coverage-analyzer agent to identify:
   - missing tests
   - untested branches
   - edge cases

4. Use the refactoring-suggester agent to identify:
   - modernization opportunities
   - simplifications
   - architecture improvements

5. Aggregate all results into ReviewReportSchema.

Return only data matching ReviewReportSchema.
`;