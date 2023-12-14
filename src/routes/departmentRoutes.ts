import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import { protect } from '../middleware/auth';

const router = Router();

const departmentController = new DepartmentController();

router.post('/', protect, departmentController.createDepartment);

router.get('/', protect, departmentController.getDepartments);

router.get('/:departmentId', protect, departmentController.getDepartment);

export default router;
