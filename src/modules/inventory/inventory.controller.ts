import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { inventoryService } from './inventory.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { barbershopId } = req.query as Record<string, string | undefined>;
    const filters = { ownerId: req.userId!, ...(barbershopId ? { barbershopId } : {}) };
    const items = await inventoryService.getAll(filters);
    res.json(items);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await inventoryService.getById(req.params.id as string);
    res.json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, photo, count, categoryId, barbershopId } = req.body;

    if (!name || !description || count === undefined || !categoryId) {
      res.status(400).json({ error: 'Name, description, count and categoryId are required' });
      return;
    }

    const item = await inventoryService.create({
      name, description, price, photo, count, categoryId,
      barbershopId: barbershopId ?? null,
      ownerId: req.userId ?? null,
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await inventoryService.update(req.params.id as string, req.body);
    res.json(item);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await inventoryService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const inventoryController = router;
