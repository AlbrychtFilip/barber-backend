import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { workstationsService } from './workstations.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const workstations = await workstationsService.getAll(req.userId!);
    res.json(workstations);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, barbershopId } = req.body;

    if (!name || !barbershopId) {
      res.status(400).json({ error: 'Name and barbershopId are required' });
      return;
    }

    const workstation = await workstationsService.create({ name, barbershopId }, req.userId!);
    res.status(201).json(workstation);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const workstation = await workstationsService.update(req.params.id as string, req.body, req.userId!);
    res.json(workstation);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await workstationsService.delete(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const workstationsController = router;
