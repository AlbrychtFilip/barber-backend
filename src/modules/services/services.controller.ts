import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { servicesService } from './services.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { barbershopId } = req.query as Record<string, string | undefined>;
    const services = await servicesService.getAll(req.userId!, barbershopId);
    res.json(services);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const service = await servicesService.getById(req.params.id as string);
    res.json(service);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, barbershopId, serviceTime } = req.body;

    if (!name || !barbershopId || !serviceTime) {
      res.status(400).json({ error: 'name, barbershopId and serviceTime are required' });
      return;
    }

    const service = await servicesService.create({ name, barbershopId, serviceTime, ownerId: req.userId! });
    res.status(201).json(service);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const service = await servicesService.update(req.params.id as string, req.body);
    res.json(service);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await servicesService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/prices', async (req: AuthRequest, res: Response) => {
  try {
    const { price, currency, serviceId, barbershopId, employeeId } = req.body;

    if (!price || !serviceId || !barbershopId || !employeeId) {
      res.status(400).json({ error: 'price, serviceId, barbershopId and employeeId are required' });
      return;
    }

    const servicePrice = await servicesService.createPrice({ price, currency, serviceId, barbershopId, employeeId });
    res.status(201).json(servicePrice);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/prices/:id', async (req: AuthRequest, res: Response) => {
  try {
    const servicePrice = await servicesService.updatePrice(req.params.id as string, req.body);
    res.json(servicePrice);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/prices/:id', async (req: AuthRequest, res: Response) => {
  try {
    await servicesService.deletePrice(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const servicesController = router;
