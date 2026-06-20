import { runReminderJob } from '../cron/reminderJob';
import { runAutoCompleteJob } from '../cron/autoCompleteJob';

const jobs: Record<string, () => Promise<void>> = {
  reminder: runReminderJob,
  'auto-complete': runAutoCompleteJob,
};

async function main() {
  const jobName = process.argv[2];

  if (!jobName || !jobs[jobName]) {
    console.error(`Usage: npx tsx src/scripts/run-job.ts <job-name>`);
    console.error(`Available jobs: ${Object.keys(jobs).join(', ')}`);
    process.exit(1);
  }

  console.log(`Running job: ${jobName}`);
  await jobs[jobName]();
  console.log(`Job '${jobName}' finished`);
  process.exit(0);
}

main();
