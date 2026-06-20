import { barbershopsRepository } from './barbershops.repository';

export const barbershopsService = {
  async getAll(ownerId: string) {
    return barbershopsRepository.findAllByOwner(ownerId);
  },

  async getById(id: string, ownerId: string) {
    const barbershop = await barbershopsRepository.findById(id);
    if (!barbershop || barbershop.ownerId !== ownerId) {
      throw { status: 404, message: 'Barbershop not found' };
    }
    return barbershop;
  },

  async create(data: { name: string; address: string; phoneNumber: string }, ownerId: string) {
    return barbershopsRepository.create({ ...data, ownerId });
  },

  async update(id: string, data: { name?: string; address?: string; phoneNumber?: string }, ownerId: string) {
    await this.getById(id, ownerId);
    return barbershopsRepository.update(id, data);
  },

  async delete(id: string, ownerId: string) {
    await this.getById(id, ownerId);
    await barbershopsRepository.delete(id);
  },
};
