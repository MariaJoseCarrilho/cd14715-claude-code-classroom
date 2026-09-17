import * as dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { CodeReviewOrchestrator } from './orchestrator';
import { ReportGenerator } from './utils';

dotenv.config();

async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  if (!owner || !repo || !prStr) {
    console.error(
      'Usage: npm run dev -- <owner> <repo> <pr-number>'
    );
    process.exit(1);
  }

  const prNumber = parseInt(prStr, 10);

  if (Number.isNaN(prNumber) || prNumber <= 0) {
    console.error('PR number must be a positive integer');
    process.exit(1);
  }

  const orchestrator = new CodeReviewOrchestrator();

  const report = await orchestrator.reviewPullRequest(
    owner,
    repo,
    prNumber
  );

  const generator = new ReportGenerator();

  const jsonReport =
    generator.generateJSONReport(report);

  const markdownReport =
    generator.generateMarkdownReport(report);

  const htmlReport =
    generator.generateHTMLReport(report);

  await fs.mkdir('reports', {
    recursive: true
  });

  await fs.writeFile(
    path.join('reports', 'report.json'),
    jsonReport
  );

  await fs.writeFile(
    path.join('reports', 'report.md'),
    markdownReport
  );

  await fs.writeFile(
    path.join('reports', 'report.html'),
    htmlReport
  );

  console.log('✅ Reports generated successfully');
  console.log('📁 reports/report.json');
  console.log('📁 reports/report.md');
  console.log('📁 reports/report.html');
}

main();