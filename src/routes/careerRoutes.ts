import { Router } from 'express';
import { CareerController } from '../controllers/careerController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Career Listing
router.post('/create', protect, CareerController.createCareerListing);

router.get('/', CareerController.getCareerListings);

router.get('/:careerListingId', protect, CareerController.getCareerListingById);

router.patch('/:careerListingId', protect);

router.delete('/careerListingId', protect);

// Career Application
router.post('/:careerListingId/application/create', CareerController.createCareerApplication);

router.get('/applications', protect, CareerController.getCareerApplications);

router.get('/applications/:careerListingId', protect);

router.patch('/applications/:careerListingId', protect);

router.delete('/applications/:careerListingId', protect);

// Resume
router.post('/resumes/create', CareerController.createResume);

export default router;
