import db from '../../config/database';

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  ownerId: string;
  created_at: Date;
  updated_at: Date;
}

export const barbershopsRepository = {
  async findAllByOwner(ownerId: string): Promise<Barbershop[]> {
    return db('barbershops').where({ ownerId });
  },

  async findById(id: string): Promise<Barbershop | undefined> {
    return db('barbershops').where({ id }).first();
  },

  async create(data: Omit<Barbershop, 'id' | 'created_at' | 'updated_at'>): Promise<Barbershop> {
    const [barbershop] = await db('barbershops').insert(data).returning('*');
    return barbershop;
  },

  async update(id: string, data: Partial<Pick<Barbershop, 'name' | 'address' | 'phoneNumber'>>): Promise<Barbershop> {
    const [barbershop] = await db('barbershops').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return barbershop;
  },

  async delete(id: string): Promise<void> {
    await db('barbershops').where({ id }).delete();
  },
};
