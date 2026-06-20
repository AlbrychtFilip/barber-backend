import { appointmentsRepository } from '../modules/appointments/appointments.repository';
import { notificationsService } from '../modules/notifications/notifications.service';

export async function runReminderJob(): Promise<void> {
  try {
    const appointments = await appointmentsRepository.findPendingReminders();

    for (const appointment of appointments) {
      const barbershopName = await appointmentsRepository.getBarbershopName(appointment.workstationId);

      const smsSent = await notificationsService.sendSms(
        appointment.clientPhoneNumber,
        `Przypominamy o wizycie w salonie ${barbershopName} zaplanowanej na ${new Date(appointment.startTime).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}.`
      );

      if (smsSent) {
        await appointmentsRepository.update(appointment.id, { reminderNotificationSent: true });
      }
    }

    if (appointments.length > 0) {
      console.log(`Reminder job: processed ${appointments.length} appointment(s)`);
    }
  } catch (error) {
    console.error('Reminder job failed:', error);
  }
}
