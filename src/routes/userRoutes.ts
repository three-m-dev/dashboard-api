import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/auth', UserController.authUser);

router.post('/', protect, UserController.createUser);

router.get('/', protect, UserController.getUsers);

router.get('/:userId', protect, UserController.getUserById);

export default router;
