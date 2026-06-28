import db from '../../config/database';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  photo: string | null;
  count: number;
  categoryId: string;
  barbershopId: string | null;
  ownerId: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryFilters {
  ownerId: string;
  barbershopId?: string;
}

export const inventoryRepository = {
  async findAll(filters: InventoryFilters): Promise<InventoryItem[]> {
    const query = db('inventory').where({ ownerId: filters.ownerId });
    if (filters.barbershopId) {
      query.where({ barbershopId: filters.barbershopId });
    }
    return query;
  },

  async findById(id: string): Promise<InventoryItem | undefined> {
    return db('inventory').where({ id }).first();
  },

  async create(data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    const [item] = await db('inventory').insert(data).returning('*');
    return item;
  },

  async update(id: string, data: Partial<Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>>): Promise<InventoryItem> {
    const [item] = await db('inventory').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return item;
  },

  async delete(id: string): Promise<void> {
    await db('inventory').where({ id }).delete();
  },
};
