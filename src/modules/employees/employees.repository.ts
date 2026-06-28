import db from '../../config/database';

export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  barbershopId: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export const employeesRepository = {
  async findAll(ownerId: string, barbershopId?: string): Promise<Employee[]> {
    const query = db('employees').where({ ownerId });
    if (barbershopId) query.where({ barbershopId });
    return query;
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
