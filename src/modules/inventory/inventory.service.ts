import { inventoryRepository, InventoryFilters } from './inventory.repository';

export const inventoryService = {
  async getAll(filters: InventoryFilters) {
    return inventoryRepository.findAll(filters);
  },

  async getById(id: string) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw { status: 404, message: 'Inventory item not found' };
    }
    return item;
  },

  async create(data: { name: string; description: string; price?: number; photo?: string; count: number; categoryId: string; barbershopId?: string | null; ownerId?: string | null }) {
    return inventoryRepository.create({
      name: data.name,
      description: data.description,
      price: data.price ?? null,
      photo: data.photo ?? null,
      count: data.count,
      categoryId: data.categoryId,
      barbershopId: data.barbershopId ?? null,
      ownerId: data.ownerId ?? null,
    });
  },

  async update(id: string, data: Partial<{ name: string; description: string; price: number | null; photo: string; count: number; categoryId: string; barbershopId: string | null; ownerId: string | null }>) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw { status: 404, message: 'Inventory item not found' };
    }
    return inventoryRepository.update(id, data);
  },

  async delete(id: string) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw { status: 404, message: 'Inventory item not found' };
    }
    await inventoryRepository.delete(id);
  },
};
