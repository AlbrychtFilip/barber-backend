import cron from 'node-cron';
import { runReminderJob } from './reminderJob';
import { runAutoCompleteJob } from './autoCompleteJob';

export function startScheduler(): void {
  const reminderInterval = process.env.CRON_REMINDER_INTERVAL || '*/15 * * * *';
  const autoCompleteInterval = process.env.CRON_AUTO_COMPLETE_INTERVAL || '*/15 * * * *';

  cron.schedule(reminderInterval, async () => {
    console.log(`[CRON] Running reminder job at ${new Date().toISOString()}`);
    await runReminderJob();
  });

  cron.schedule(autoCompleteInterval, async () => {
    console.log(`[CRON] Running auto-complete job at ${new Date().toISOString()}`);
    await runAutoCompleteJob();
  });

  console.log(`Cron reminder job interval: ${reminderInterval}`);
  console.log(`Cron auto-complete job interval: ${autoCompleteInterval}`);
}
