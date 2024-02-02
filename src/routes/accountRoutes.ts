import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { protect } from '../middleware/auth';

const router = Router();

const accountController = new AccountController();

router.post('/login', accountController.login);

router.post('/logout', protect, accountController.logout);

router.get('/session', protect, accountController.session);

router.post('/create', accountController.createAccount);

router.get('/', protect, accountController.getAccounts);

router.get('/:accountId', protect, accountController.getAccount);

router.patch('/:accountId', protect, accountController.updateAccount);

router.delete('/:accountId', protect, accountController.deleteAccount);

export default router;
