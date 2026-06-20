import db from '../../config/database';

export interface Workstation {
  id: string;
  name: string;
  barbershopId: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export const workstationsRepository = {
  async findAllByOwner(ownerId: string): Promise<Workstation[]> {
    return db('workstations').where({ ownerId });
  },

  async findById(id: string): Promise<Workstation | undefined> {
    return db('workstations').where({ id }).first();
  },

  async create(data: Omit<Workstation, 'id' | 'created_at' | 'updated_at'>): Promise<Workstation> {
    const [workstation] = await db('workstations').insert(data).returning('*');
    return workstation;
  },

  async update(id: string, data: Partial<Pick<Workstation, 'name' | 'barbershopId'>>): Promise<Workstation> {
    const [workstation] = await db('workstations').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return workstation;
  },

  async delete(id: string): Promise<void> {
    await db('workstations').where({ id }).delete();
  },
};
