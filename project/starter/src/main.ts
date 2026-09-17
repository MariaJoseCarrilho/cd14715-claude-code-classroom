import * as dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { CodeReviewOrchestrator } from './orchestrator';
import { ReportGenerator } from './utils';

dotenv.config();

const hasAnthropicAPI =
  !!process.env.ANTHROPIC_API_KEY;

const hasAWSCredentials =
  !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION
  );

async function main(): Promise<void> {

try {
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

  if (!hasAnthropicAPI && !hasAWSCredentials) {
  console.error(
    'Authentication required. Configure one of:'
  );

  console.error(
    '  - ANTHROPIC_API_KEY'
  );

  console.error(
    '  - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + AWS_REGION'
  );

  process.exit(1);
}

console.log(
  `🔐 Using ${
    hasAnthropicAPI
      ? 'Anthropic API'
      : 'AWS Bedrock'
  } authentication`
);

if (!process.env.ANTHROPIC_MODEL) {
  console.error(
    'ANTHROPIC_MODEL is required.'
  );

  console.error(
    'Examples:'
  );

  console.error(
    'Anthropic API: claude-sonnet-4-5-20250929'
  );

  console.error(
    'AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0'
  );

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

const reportName =
  `${owner}_${repo}_${prNumber}`;

const jsonPath =
  path.join(
    'reports',
    `${reportName}.json`
  );

const mdPath =
  path.join(
    'reports',
    `${reportName}.md`
  );

const htmlPath =
  path.join(
    'reports',
    `${reportName}.html`
  );

await fs.writeFile(
  jsonPath,
  jsonReport
);

await fs.writeFile(
  mdPath,
  markdownReport
);

await fs.writeFile(
  htmlPath,
  htmlReport
);

console.log('✅ Reports generated successfully');
console.log(`📁 ${jsonPath}`);
console.log(`📁 ${mdPath}`);
console.log(`📁 ${htmlPath}`);
``

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
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `❌ Review failed: ${error.message}`
      );
    } else {
      console.error(
        '❌ Unknown error occurred'
      );
    }

    process.exit(1);
  }
}
void main();