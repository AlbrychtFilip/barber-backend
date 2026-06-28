import { servicesRepository } from './services.repository';

export const servicesService = {
  async getAll(ownerId: string, barbershopId?: string) {
    return servicesRepository.findAll(ownerId, barbershopId);
  },

  async getById(id: string) {
    const service = await servicesRepository.findById(id);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }
    return service;
  },

  async create(data: { name: string; barbershopId: string; ownerId: string; serviceTime: number }) {
    return servicesRepository.create(data);
  },

  async update(id: string, data: Partial<{ name: string; barbershopId: string; serviceTime: number }>) {
    const service = await servicesRepository.findById(id);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }
    return servicesRepository.update(id, data);
  },

  async delete(id: string) {
    const service = await servicesRepository.findById(id);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }
    await servicesRepository.delete(id);
  },

  async createPrice(data: {
    price: number;
    currency?: 'USD' | 'PLN' | 'EUR';
    serviceId: string;
    barbershopId: string;
    employeeId: string;
  }) {
    const service = await servicesRepository.findById(data.serviceId);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }
    return servicesRepository.createPrice({
      price: data.price,
      currency: data.currency ?? 'PLN',
      serviceId: data.serviceId,
      barbershopId: data.barbershopId,
      employeeId: data.employeeId,
    });
  },

  async updatePrice(
    id: string,
    data: Partial<{ price: number; currency: 'USD' | 'PLN' | 'EUR'; serviceId: string; barbershopId: string; employeeId: string }>
  ) {
    const price = await servicesRepository.findPriceById(id);
    if (!price) {
      throw { status: 404, message: 'Service price not found' };
    }
    return servicesRepository.updatePrice(id, data);
  },

  async deletePrice(id: string) {
    const price = await servicesRepository.findPriceById(id);
    if (!price) {
      throw { status: 404, message: 'Service price not found' };
    }
    await servicesRepository.deletePrice(id);
  },
};
