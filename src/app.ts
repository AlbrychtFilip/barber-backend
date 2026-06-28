import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth';
import { authController } from './modules/auth/auth.controller';
import { barbershopsController } from './modules/barbershops/barbershops.controller';
import { categoriesController } from './modules/categories/categories.controller';
import { inventoryController } from './modules/inventory/inventory.controller';
import { workstationsController } from './modules/workstations/workstations.controller';
import { employeesController } from './modules/employees/employees.controller';
import { appointmentsController } from './modules/appointments/appointments.controller';
import { servicesController } from './modules/services/services.controller';
import { usedInventoryController } from './modules/usedInventory/usedInventory.controller';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authController);
app.use('/api/barbershops', authMiddleware, barbershopsController);
app.use('/api/categories', authMiddleware, categoriesController);
app.use('/api/inventory', authMiddleware, inventoryController);
app.use('/api/workstations', authMiddleware, workstationsController);
app.use('/api/employees', authMiddleware, employeesController);
app.use('/api/appointments', authMiddleware, appointmentsController);
app.use('/api/services', authMiddleware, servicesController);
app.use('/api/used-inventory', authMiddleware, usedInventoryController);

export default app;
