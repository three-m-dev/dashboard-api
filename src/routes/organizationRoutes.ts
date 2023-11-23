import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationService';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Authentication routes
router.post('/auth', OrganizationController.authUser);
router.post('/logout', protect, OrganizationController.logoutUser);
router.get('/session', protect, OrganizationController.validateSession);

// User routes
router.get('/users', protect, OrganizationController.getUsers);
router.get('/users/:userId', protect, OrganizationController.getUserById);

// Team Member routes
router.get('/team-members', protect, OrganizationController.getTeamMembers);
router.get('/team-members/:teamMemberId', protect, OrganizationController.getTeamMemberById);

// Transaction routes
router.post('/team-members', protect, OrganizationController.createUserAndTeamMember);

// Department Routes
router.post('/departments', protect, OrganizationController.createDepartment);
router.get('/departments', protect, OrganizationController.getDepartments);

// Email routes (move these eventually)
router.post('/team-members/:teamMemberId/welcome', protect, OrganizationController.sendWelcomeEmail);
router.post('/team-members/:teamMemberId/reset', protect, OrganizationController.sendPasswordResetEmail);

export default router;
