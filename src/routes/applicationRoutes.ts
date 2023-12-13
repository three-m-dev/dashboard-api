import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { protect } from '../middleware/auth';

const router = Router();

const applicationController = new ApplicationController();

router.post('/', protect, applicationController.createApplication);

export default router;
