import { Router } from 'express';
import { DowntimeController } from '../controllers/downtimeController';
import { protect } from '../middleware/auth';

const router = Router();

const downtimeController = new DowntimeController();

router.post('/', protect, downtimeController.createDowntimeEntry);

router.get('/', protect, downtimeController.getDowntimeEntries);

router.get('/report', protect, downtimeController.generateDowntimeReport);

export default router;
