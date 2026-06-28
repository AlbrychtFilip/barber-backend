import { employeesRepository } from './employees.repository';

export const employeesService = {
  async getAll(ownerId: string, barbershopId?: string) {
    return employeesRepository.findAll(ownerId, barbershopId);
  },

  async getById(id: string) {
    const employee = await employeesRepository.findById(id);
    if (!employee) {
      throw { status: 404, message: 'Employee not found' };
    }
    return employee;
  },

  async create(data: { name: string; surname: string; email: string; phoneNumber: string; barbershopId: string; ownerId: string }) {
    return employeesRepository.create(data);
  },

  async update(id: string, data: Partial<{ name: string; surname: string; email: string; phoneNumber: string; barbershopId: string }>) {
    const employee = await employeesRepository.findById(id);
    if (!employee) {
      throw { status: 404, message: 'Employee not found' };
    }
    return employeesRepository.update(id, data);
  },

  async delete(id: string) {
    const employee = await employeesRepository.findById(id);
    if (!employee) {
      throw { status: 404, message: 'Employee not found' };
    }
    await employeesRepository.delete(id);
  },
};
