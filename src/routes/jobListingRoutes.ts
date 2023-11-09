import { Router } from 'express';
import { JobListingController } from '../controllers/jobListingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/create', protect, JobListingController.createJobListing);

router.put('/:jobListingId', protect);

router.delete('/:jobListingId', protect);

router.get('/', protect, JobListingController.getJobListings);

router.get('/:jobListingId', protect, JobListingController.getJobListingById);

export default router;
