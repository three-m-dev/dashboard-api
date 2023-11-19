import { Router } from 'express';
import { TeamController } from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Authentication routes
router.post('/auth', TeamController.authUser);
router.post('/logout', protect, TeamController.logoutUser);
router.get('/session', protect, TeamController.validateSession);

// User routes
router.get('/users', protect, TeamController.getUsers);
router.get('/users/:userId', protect, TeamController.getUserById);

// Employee routes
router.get('/employees', protect, TeamController.getEmployees);
router.get('/employees/:employeeId', protect, TeamController.getEmployeeById);

// Transaction routes
router.post('/team-member', protect, TeamController.createTeamMember);

// Email routes
router.post('/employees/:employeeId/welcome', protect, TeamController.sendWelcomeEmail);
router.post('/employees/:employeeId/reset', protect, TeamController.sendPasswordResetEmail);

export default router;
