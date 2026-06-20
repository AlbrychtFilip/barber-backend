import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { employeesService } from './employees.service';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const employees = await employeesService.getAll();
    res.json(employees);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const employee = await employeesService.getById(req.params.id as string);
    res.json(employee);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, surname, email, phoneNumber, barbershopId } = req.body;

    if (!name || !surname || !email || !phoneNumber || !barbershopId) {
      res.status(400).json({ error: 'Name, surname, email, phoneNumber and barbershopId are required' });
      return;
    }

    const employee = await employeesService.create({ name, surname, email, phoneNumber, barbershopId });
    res.status(201).json(employee);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const employee = await employeesService.update(req.params.id as string, req.body);
    res.json(employee);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await employeesService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const employeesController = router;
