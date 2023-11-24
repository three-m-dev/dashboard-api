import { Router } from 'express';
import { CareerController } from '../controllers/careerController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Career Listing
router.post('/create', protect, CareerController.createCareerListing);
router.get('/', CareerController.getCareerListings);

// Career Applications
router.get('/applications', protect, CareerController.getCareerApplications);

// Specific career listing routes should come after the more general '/applications' route
router.get('/:careerListingId', protect, CareerController.getCareerListingById);
router.patch('/:careerListingId', protect);
router.delete('/:careerListingId', protect);

// Career Application routes for specific career listings
router.post('/:careerListingId/applications/create', CareerController.createCareerApplication);
router.get('/applications/:careerListingId', protect);
router.patch('/applications/:careerListingId', protect);
router.delete('/applications/:careerListingId', protect);

// Resume
router.post('/resumes/create', CareerController.createResume);

export default router;
