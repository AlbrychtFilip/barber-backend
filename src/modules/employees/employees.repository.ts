import db from '../../config/database';

export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  barbershopId: string;
  created_at: Date;
  updated_at: Date;
}

export const employeesRepository = {
  async findAllByBarbershop(barbershopId: string): Promise<Employee[]> {
    return db('employees').where({ barbershopId });
  },

  async findAll(): Promise<Employee[]> {
    return db('employees');
  },

  async findById(id: string): Promise<Employee | undefined> {
    return db('employees').where({ id }).first();
  },

  async create(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const [employee] = await db('employees').insert(data).returning('*');
    return employee;
  },

  async update(id: string, data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Promise<Employee> {
    const [employee] = await db('employees').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return employee;
  },

  async delete(id: string): Promise<void> {
    await db('employees').where({ id }).delete();
  },
};
