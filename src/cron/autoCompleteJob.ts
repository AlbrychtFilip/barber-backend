import { appointmentsRepository } from '../modules/appointments/appointments.repository';

export async function runAutoCompleteJob(): Promise<void> {
  try {
    const appointments = await appointmentsRepository.findCompletedAppointments();

    for (const appointment of appointments) {
      await appointmentsRepository.update(appointment.id, { status: 'completed' });
    }

    if (appointments.length > 0) {
      console.log(`Auto-complete job: marked ${appointments.length} appointment(s) as completed`);
    }
  } catch (error) {
    console.error('Auto-complete job failed:', error);
  }
}
