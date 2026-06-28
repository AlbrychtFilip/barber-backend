import db from '../../config/database';
import { usedInventoryRepository, UsedInventoryFilters } from './usedInventory.repository';
import { inventoryRepository } from '../inventory/inventory.repository';

export const usedInventoryService = {
  async getAll(filters: UsedInventoryFilters) {
    return usedInventoryRepository.findAll(filters);
  },

  async getById(id: string) {
    const row = await usedInventoryRepository.findById(id);
    if (!row) throw { status: 404, message: 'UsedInventory record not found' };
    return row;
  },

  async markAsUsed(data: { inventoryId: string; count: number; comment?: string | null; useType: 'SOLD' | 'USED' | 'OTHER'; usedAt?: Date }) {
    if (data.count <= 0) throw { status: 400, message: 'count must be greater than 0' };

    const item = await inventoryRepository.findById(data.inventoryId);
    if (!item) throw { status: 404, message: 'Inventory item not found' };

    const newCount = item.count - data.count;
    if (newCount < 0) throw { status: 400, message: `Niewystarczająca ilość — dostępne: ${item.count}` };

    await db.transaction(async (trx) => {
      await trx('inventory').where({ id: data.inventoryId }).update({ count: newCount, updated_at: trx.fn.now() });
      await trx('usedInventory').insert({
        inventoryId: data.inventoryId,
        count: data.count,
        comment: data.comment ?? null,
        useType: data.useType,
        usedAt: data.usedAt ?? new Date(),
      });
    });

    return inventoryRepository.findById(data.inventoryId);
  },

  async update(id: string, data: { comment?: string | null; useType?: 'SOLD' | 'USED' | 'OTHER'; usedAt?: string; count?: number }) {
    const row = await usedInventoryRepository.findById(id);
    if (!row) throw { status: 404, message: 'UsedInventory record not found' };

    if (data.count !== undefined) {
      if (data.count <= 0) throw { status: 400, message: 'count must be greater than 0' };

      const countDiff = data.count - row.count;
      if (countDiff !== 0) {
        const item = await inventoryRepository.findById(row.inventoryId);
        if (!item) throw { status: 404, message: 'Inventory item not found' };

        const newCount = item.count - countDiff;
        if (newCount < 0) throw { status: 400, message: `Niewystarczająca ilość — dostępne: ${item.count}` };

        await db.transaction(async (trx) => {
          await trx('inventory').where({ id: row.inventoryId }).update({ count: newCount, updated_at: trx.fn.now() });
          await trx('usedInventory').where({ id }).update({
            count: data.count,
            comment: data.comment !== undefined ? data.comment : row.comment,
            useType: data.useType ?? row.useType,
            usedAt: data.usedAt ? new Date(data.usedAt) : row.usedAt,
            updated_at: trx.fn.now(),
          });
        });

        return usedInventoryRepository.findById(id);
      }
    }

    return usedInventoryRepository.update(id, {
      comment: data.comment !== undefined ? data.comment : undefined,
      useType: data.useType,
      usedAt: data.usedAt ? new Date(data.usedAt) : undefined,
      count: data.count,
    });
  },

  async delete(id: string) {
    const row = await usedInventoryRepository.findById(id);
    if (!row) throw { status: 404, message: 'UsedInventory record not found' };
    await usedInventoryRepository.delete(id);
  },
};
