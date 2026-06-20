import { workstationsRepository } from './workstations.repository';

export const workstationsService = {
  async getAll(ownerId: string) {
    return workstationsRepository.findAllByOwner(ownerId);
  },

  async getById(id: string, ownerId: string) {
    const workstation = await workstationsRepository.findById(id);
    if (!workstation || workstation.ownerId !== ownerId) {
      throw { status: 404, message: 'Workstation not found' };
    }
    return workstation;
  },

  async create(data: { name: string; barbershopId: string }, ownerId: string) {
    return workstationsRepository.create({ ...data, ownerId });
  },

  async update(id: string, data: { name?: string; barbershopId?: string }, ownerId: string) {
    await this.getById(id, ownerId);
    return workstationsRepository.update(id, data);
  },

  async delete(id: string, ownerId: string) {
    await this.getById(id, ownerId);
    await workstationsRepository.delete(id);
  },
};
