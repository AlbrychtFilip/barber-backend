import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { appointmentsService } from './appointments.service';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, employeeId, workstationId } = req.query as Record<string, string | undefined>;
    const appointments = await appointmentsService.getAll({ date, employeeId, workstationId });
    res.json(appointments);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await appointmentsService.getById(req.params.id as string);
    res.json(appointment);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhoneNumber, startTime, duration, employeeId, workstationId } = req.body;

    if (!clientName || !clientPhoneNumber || !startTime || !duration || !employeeId || !workstationId) {
      res.status(400).json({ error: 'clientName, clientPhoneNumber, startTime, duration, employeeId and workstationId are required' });
      return;
    }

    const appointment = await appointmentsService.create({
      clientName,
      clientEmail,
      clientPhoneNumber,
      startTime,
      duration,
      employeeId,
      workstationId,
    });
    res.status(201).json(appointment);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Valid status is required (scheduled, completed, cancelled)' });
      return;
    }

    const appointment = await appointmentsService.updateStatus(req.params.id as string, status);
    res.json(appointment);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await appointmentsService.update(req.params.id as string, req.body);
    res.json(appointment);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await appointmentsService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const appointmentsController = router;
