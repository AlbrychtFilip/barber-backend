import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { barbershopsService } from './barbershops.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const barbershops = await barbershopsService.getAll(req.userId!);
    res.json(barbershops);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const barbershop = await barbershopsService.getById(req.params.id as string, req.userId!);
    res.json(barbershop);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, phoneNumber } = req.body;

    if (!name || !address || !phoneNumber) {
      res.status(400).json({ error: 'Name, address and phoneNumber are required' });
      return;
    }

    const barbershop = await barbershopsService.create({ name, address, phoneNumber }, req.userId!);
    res.status(201).json(barbershop);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const barbershop = await barbershopsService.update(req.params.id as string, req.body, req.userId!);
    res.json(barbershop);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await barbershopsService.delete(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const barbershopsController = router;
