import db from '../../config/database';

export interface Service {
  id: string;
  name: string;
  barbershopId: string;
  ownerId: string;
  serviceTime: number;
  created_at: Date;
  updated_at: Date;
}

export interface ServicePrice {
  id: string;
  price: number;
  currency: 'USD' | 'PLN' | 'EUR';
  serviceId: string;
  barbershopId: string;
  employeeId: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceWithPrices extends Service {
  prices: ServicePrice[];
}

export const servicesRepository = {
  async findAll(ownerId: string, barbershopId?: string): Promise<ServiceWithPrices[]> {
    const query = db('services').where({ ownerId });
    if (barbershopId) query.where({ barbershopId });
    const services = await query;
    return Promise.all(services.map((s) => servicesRepository.attachPrices(s)));
  },

  async findById(id: string): Promise<ServiceWithPrices | undefined> {
    const service = await db('services').where({ id }).first();
    if (!service) return undefined;
    return servicesRepository.attachPrices(service);
  },

  async create(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceWithPrices> {
    const [service] = await db('services').insert(data).returning('*');
    return servicesRepository.attachPrices(service);
  },

  async update(id: string, data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceWithPrices> {
    const [service] = await db('services').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return servicesRepository.attachPrices(service);
  },

  async delete(id: string): Promise<void> {
    await db('services').where({ id }).delete();
  },

  async attachPrices(service: Service): Promise<ServiceWithPrices> {
    const prices = await db('servicePrices').where({ serviceId: service.id });
    return { ...service, prices };
  },

  async findPriceById(id: string): Promise<ServicePrice | undefined> {
    return db('servicePrices').where({ id }).first();
  },

  async createPrice(data: Omit<ServicePrice, 'id' | 'created_at' | 'updated_at'>): Promise<ServicePrice> {
    const [price] = await db('servicePrices').insert(data).returning('*');
    return price;
  },

  async updatePrice(id: string, data: Partial<Omit<ServicePrice, 'id' | 'created_at' | 'updated_at'>>): Promise<ServicePrice> {
    const [price] = await db('servicePrices').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return price;
  },

  async deletePrice(id: string): Promise<void> {
    await db('servicePrices').where({ id }).delete();
  },
};
