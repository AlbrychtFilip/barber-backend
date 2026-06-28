import db from '../../config/database';

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string | null;
  clientPhoneNumber: string;
  startTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceId: string;
  employeeId: string;
  workstationId: string;
  ownerId: string;
  initialNotificationSent: boolean;
  reminderNotificationSent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppointmentFilters {
  ownerId: string;
  date?: string;
  barbershopId?: string;
  employeeId?: string;
  workstationId?: string;
}

export interface SummaryFilters {
  ownerId: string;
  from: string;
  to: string;
  barbershopId?: string;
  employeeId?: string;
  workstationId?: string;
}

export interface AppointmentSummary {
  totalAppointments: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  projectedRevenue: number;
  currency: string;
}

export const appointmentsRepository = {
  async findAll(filters: AppointmentFilters): Promise<Appointment[]> {
    const query = db('appointments').select('appointments.*').where('appointments.ownerId', filters.ownerId);

    if (filters.barbershopId) {
      query
        .join('workstations', 'appointments.workstationId', 'workstations.id')
        .where('workstations.barbershopId', filters.barbershopId);
    }
    if (filters.date) {
      query.whereRaw('DATE(appointments."startTime") = ?', [filters.date]);
    }
    if (filters.employeeId) {
      query.where('appointments.employeeId', filters.employeeId);
    }
    if (filters.workstationId) {
      query.where('appointments.workstationId', filters.workstationId);
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

  async getSummary(filters: SummaryFilters): Promise<AppointmentSummary> {
    const query = db('appointments')
      .leftJoin('servicePrices', function () {
        this.on('servicePrices.serviceId', '=', 'appointments.serviceId')
          .andOn('servicePrices.employeeId', '=', 'appointments.employeeId');
      })
      .join('workstations', 'appointments.workstationId', 'workstations.id')
      .where('appointments.ownerId', filters.ownerId)
      .whereRaw('DATE(appointments."startTime") >= ?', [filters.from])
      .whereRaw('DATE(appointments."startTime") <= ?', [filters.to])
      .select('appointments.status', 'servicePrices.price', 'servicePrices.currency');

    if (filters.barbershopId) {
      query.where('workstations.barbershopId', filters.barbershopId);
    }
    if (filters.employeeId) {
      query.where('appointments.employeeId', filters.employeeId);
    }
    if (filters.workstationId) {
      query.where('appointments.workstationId', filters.workstationId);
    }

    const rows = await query;

    const toNum = (v: any) => (v !== null && v !== undefined ? parseFloat(v) : 0);

    const completed = rows.filter((r) => r.status === 'completed');
    const scheduled = rows.filter((r) => r.status === 'scheduled');
    const currencies = rows.map((r) => r.currency).filter(Boolean);
    const currencyCounts: Record<string, number> = currencies.reduce((acc: Record<string, number>, c: string) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dominantCurrency = currencies.length
      ? (Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0][0])
      : 'PLN';

    return {
      totalAppointments: rows.length,
      scheduled: scheduled.length,
      completed: completed.length,
      cancelled: rows.filter((r) => r.status === 'cancelled').length,
      totalRevenue: parseFloat(completed.reduce((sum, r) => sum + toNum(r.price), 0).toFixed(2)),
      projectedRevenue: parseFloat(scheduled.reduce((sum, r) => sum + toNum(r.price), 0).toFixed(2)),
      currency: dominantCurrency,
    };
  },

  async findCompletedAppointments(): Promise<Appointment[]> {
    return db('appointments')
      .join('services', 'appointments.serviceId', 'services.id')
      .where('appointments.status', 'scheduled')
      .whereRaw('appointments."startTime" + (services."serviceTime" || \' minutes\')::INTERVAL <= NOW()')
      .select('appointments.*');
  },
};
