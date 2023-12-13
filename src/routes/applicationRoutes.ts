import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { protect } from '../middleware/auth';

const router = Router();

const applicationController = new ApplicationController();

router.post('/', protect, applicationController.createApplication);

router.get('/', protect, applicationController.getApplications);

router.get('/:applicationId', protect, applicationController.getApplication);

router.patch('/:applicationId', protect, applicationController.updateApplication);

router.delete('/:applicationId', protect, applicationController.deleteApplication);

export default router;
