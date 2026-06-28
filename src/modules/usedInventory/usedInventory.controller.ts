import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { usedInventoryService } from './usedInventory.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { inventoryId, barbershopId } = req.query as Record<string, string | undefined>;
    const filters = { ownerId: req.userId!, ...(barbershopId ? { barbershopId } : {}), ...(inventoryId ? { inventoryId } : {}) };
    const rows = await usedInventoryService.getAll(filters);
    res.json(rows);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const row = await usedInventoryService.getById(req.params.id as string);
    res.json(row);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { inventoryId, count, comment, useType, usedAt } = req.body;

    if (!inventoryId || count === undefined || !useType) {
      res.status(400).json({ error: 'inventoryId, count and useType are required' });
      return;
    }

    if (!['SOLD', 'USED', 'OTHER'].includes(useType)) {
      res.status(400).json({ error: 'useType must be SOLD, USED or OTHER' });
      return;
    }

    const item = await usedInventoryService.markAsUsed({
      inventoryId,
      count: Number(count),
      comment: comment ?? null,
      useType,
      usedAt: usedAt ? new Date(usedAt) : undefined,
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { comment, useType, usedAt, count } = req.body;

    if (useType && !['SOLD', 'USED', 'OTHER'].includes(useType)) {
      res.status(400).json({ error: 'useType must be SOLD, USED or OTHER' });
      return;
    }

    const row = await usedInventoryService.update(req.params.id as string, {
      comment,
      useType,
      usedAt,
      count: count !== undefined ? Number(count) : undefined,
    });
    res.json(row);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await usedInventoryService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const usedInventoryController = router;
