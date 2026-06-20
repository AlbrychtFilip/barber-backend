import db from '../../config/database';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  photo: string | null;
  count: number;
  categoryId: string;
  created_at: Date;
  updated_at: Date;
}

export const inventoryRepository = {
  async findAll(): Promise<InventoryItem[]> {
    return db('inventory');
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
