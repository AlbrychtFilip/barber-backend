import db from '../../config/database';

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string | null;
  clientPhoneNumber: string;
  startTime: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  employeeId: string;
  workstationId: string;
  initialNotificationSent: boolean;
  reminderNotificationSent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppointmentFilters {
  date?: string;
  employeeId?: string;
  workstationId?: string;
}

export const appointmentsRepository = {
  async findAll(filters: AppointmentFilters): Promise<Appointment[]> {
    const query = db('appointments');

    if (filters.date) {
      query.whereRaw('DATE("startTime") = ?', [filters.date]);
    }
    if (filters.employeeId) {
      query.where({ employeeId: filters.employeeId });
    }
    if (filters.workstationId) {
      query.where({ workstationId: filters.workstationId });
    }

    return query;
  },

  async findById(id: string): Promise<Appointment | undefined> {
    return db('appointments').where({ id }).first();
  },

  async create(data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const [appointment] = await db('appointments').insert(data).returning('*');
    return appointment;
  },

  async update(id: string, data: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>): Promise<Appointment> {
    const [appointment] = await db('appointments').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return appointment;
  },

  async delete(id: string): Promise<void> {
    await db('appointments').where({ id }).delete();
  },

  async getBarbershopName(workstationId: string): Promise<string> {
    const result = await db('workstations')
      .join('barbershops', 'workstations.barbershopId', 'barbershops.id')
      .where('workstations.id', workstationId)
      .select('barbershops.name')
      .first();
    return result?.name ?? '';
  },

  async findPendingReminders(): Promise<Appointment[]> {
    return db('appointments')
      .where('status', 'scheduled')
      .where('reminderNotificationSent', false)
      .whereRaw('"startTime" <= NOW() + INTERVAL \'24 hours\'')
      .whereRaw('"startTime" > NOW()');
  },

  async findCompletedAppointments(): Promise<Appointment[]> {
    return db('appointments')
      .where('status', 'scheduled')
      .whereRaw('"startTime" + ("duration" || \' minutes\')::INTERVAL <= NOW()');
  },
};
