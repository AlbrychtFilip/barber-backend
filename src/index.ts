import app from './app';
import { startScheduler } from './cron/scheduler';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Barber backend is running on port ${PORT}`);
  startScheduler();
});
