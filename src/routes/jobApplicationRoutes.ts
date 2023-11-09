import { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplicationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/create/:jobListingId', JobApplicationController.createJobApplication);

router.put('/:jobApplicationId', protect);

router.delete('/:jobApplicationId', protect);

router.get('/', protect, JobApplicationController.getJobApplications);

router.get('/:jobApplicationId', protect);

export default router;
