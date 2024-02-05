import { Router } from 'express';
import { ProductionController } from '../controllers/production.controller';
import { protect } from '../middleware/auth';

const router = Router();

const productionController = new ProductionController();

router.post('/logs/create', protect, productionController.createProductionLog);

router.get('/logs/', protect, productionController.getProductionLogs);

router.get('/logs/:productionLogId', protect, productionController.getProductionLog);

router.patch('/logs/:productionLogId', protect, productionController.updateProductionLog);

router.delete('/logs/:productionLogId', protect, productionController.deleteProductionLog);

export default router;
