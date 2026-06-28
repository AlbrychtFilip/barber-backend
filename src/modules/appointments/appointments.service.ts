import { appointmentsRepository, AppointmentFilters, SummaryFilters } from './appointments.repository';
import { notificationsService } from '../notifications/notifications.service';

export const appointmentsService = {
  async getAll(filters: AppointmentFilters) {
    return appointmentsRepository.findAll(filters);
  },

  async getById(id: string) {
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) {
      throw { status: 404, message: 'Appointment not found' };
    }
    return appointment;
  },

  async create(data: {
    clientName: string;
    clientEmail?: string;
    clientPhoneNumber: string;
    startTime: string;
    serviceId: string;
    employeeId: string;
    workstationId: string;
    ownerId: string;
  }) {
    const appointment = await appointmentsRepository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail ?? null,
      clientPhoneNumber: data.clientPhoneNumber,
      startTime: new Date(data.startTime),
      serviceId: data.serviceId,
      status: 'scheduled',
      employeeId: data.employeeId,
      workstationId: data.workstationId,
      ownerId: data.ownerId,
      initialNotificationSent: false,
      reminderNotificationSent: false,
    });

    const barbershopName = await appointmentsRepository.getBarbershopName(data.workstationId);

    const smsSent = await notificationsService.sendSms(
      data.clientPhoneNumber,
      `Twoja wizyta w salonie ${barbershopName} została zaplanowana na ${new Date(data.startTime).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}.`
    );

    if (smsSent) {
      return appointmentsRepository.update(appointment.id, { initialNotificationSent: true });
    }

    return appointment;
  },

  async update(id: string, data: Partial<{
    clientName: string;
    clientEmail: string | null;
    clientPhoneNumber: string;
    startTime: string;
    serviceId: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    employeeId: string;
    workstationId: string;
  }>) {
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) {
      throw { status: 404, message: 'Appointment not found' };
    }

    const updateData: any = { ...data };
    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }

    return appointmentsRepository.update(id, updateData);
  },

  async updateStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled') {
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) {
      throw { status: 404, message: 'Appointment not found' };
    }
    return appointmentsRepository.update(id, { status });
  },

  async getSummary(filters: SummaryFilters) {
    if (!filters.from || !filters.to) {
      throw { status: 400, message: 'from and to date params are required' };
    }
    return appointmentsRepository.getSummary(filters);
  },

  async delete(id: string) {
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) {
      throw { status: 404, message: 'Appointment not found' };
    }
    await appointmentsRepository.delete(id);
  },
};
