import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/create/:userId', protect, EmployeeController.createEmployee);

router.post('/:employeeId/welcome-email', EmployeeController.sendWelcomeEmail);

router.get('/:employeeId', protect, EmployeeController.getEmployeeById);

router.put('/:employeeId', protect);

router.delete('/:employeeId', protect);

router.get('/', protect, EmployeeController.getEmployees);

export default router;
