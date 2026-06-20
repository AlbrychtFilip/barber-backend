import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { categoriesService } from './categories.service';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await categoriesService.getAll();
    res.json(categories);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoriesService.getById(req.params.id as string);
    res.json(category);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, photo } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const category = await categoriesService.create({ name, photo });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoriesService.update(req.params.id as string, req.body);
    res.json(category);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await categoriesService.delete(req.params.id as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.post('/:id/subcategories', async (req: AuthRequest, res: Response) => {
  try {
    const { subcategoryId } = req.body;

    if (!subcategoryId) {
      res.status(400).json({ error: 'subcategoryId is required' });
      return;
    }

    await categoriesService.addSubcategory(req.params.id as string, subcategoryId);
    res.status(201).json({ message: 'Subcategory added' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

router.delete('/:id/subcategories/:subcategoryId', async (req: AuthRequest, res: Response) => {
  try {
    await categoriesService.removeSubcategory(req.params.id as string, req.params.subcategoryId as string);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
});

export const categoriesController = router;
