import { Router } from 'express';
import { SubscriberController } from '../controllers/subscriberController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/create', SubscriberController.createSubscriber);

router.put('/:subscriberId', protect);

router.delete('/:subscriberId', protect);

router.get('/', protect);

router.get('/:subscriberId', protect);

export default router;
