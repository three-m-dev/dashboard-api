import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { protect } from '../middleware/auth';

const router = Router();

const employeeController = new EmployeeController();

router.get('/', protect, employeeController.getEmployees);

router.get('/:employeeId', protect, employeeController.getEmployee);

router.patch('/:employeeId', protect, employeeController.updateEmployee);

router.delete('/:employeeId', protect, employeeController.deleteEmployee);

export default router;
