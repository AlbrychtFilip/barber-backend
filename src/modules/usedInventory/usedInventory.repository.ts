import db from '../../config/database';

export interface UsedInventory {
  id: string;
  inventoryId: string;
  count: number;
  comment: string | null;
  usedAt: Date;
  useType: 'SOLD' | 'USED' | 'OTHER';
  created_at: Date;
  updated_at: Date;
}

export interface UsedInventoryFilters {
  ownerId: string;
  inventoryId?: string;
  barbershopId?: string;
}

export const usedInventoryRepository = {
  async findAll(filters: UsedInventoryFilters): Promise<UsedInventory[]> {
    const query = db('usedInventory')
      .select('usedInventory.*')
      .join('inventory', 'usedInventory.inventoryId', 'inventory.id')
      .where('inventory.ownerId', filters.ownerId)
      .orderBy('usedInventory.usedAt', 'desc');

    if (filters.barbershopId) query.where('inventory.barbershopId', filters.barbershopId);
    if (filters.inventoryId) query.where('usedInventory.inventoryId', filters.inventoryId);

    return query;
  },

  async findById(id: string): Promise<UsedInventory | undefined> {
    return db('usedInventory').where({ id }).first();
  },

  async create(data: Omit<UsedInventory, 'id' | 'created_at' | 'updated_at'>): Promise<UsedInventory> {
    const [row] = await db('usedInventory').insert(data).returning('*');
    return row;
  },

  async update(id: string, data: Partial<Pick<UsedInventory, 'comment' | 'useType' | 'usedAt' | 'count'>>): Promise<UsedInventory> {
    const [row] = await db('usedInventory').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return row;
  },

  async delete(id: string): Promise<void> {
    await db('usedInventory').where({ id }).delete();
  },
};
