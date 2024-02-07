import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { protect } from '../middleware/auth';

const router = Router();

const emailController = new EmailController();

router.post('/signatures/create/:employeeId', protect, emailController.createEmailSignature);

export default router;
