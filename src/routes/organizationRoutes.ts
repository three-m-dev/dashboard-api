import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Authentication
router.post('/login', OrganizationController.login);
router.post('/logout', protect, OrganizationController.logout);
router.get('/session', protect, OrganizationController.session);

// Users
router.get('/users', protect, OrganizationController.getUsers);
router.get('/users/:userId', protect, OrganizationController.getUser);
router.patch('/users/:userId', protect, OrganizationController.updateUser);
router.delete('/users/:userId', protect, OrganizationController.deleteUser);

// Team Members
router.get('/team-members', protect, OrganizationController.getTeamMembers);
router.post('/team-members', protect, OrganizationController.createTeamMember);
router.get('/team-members/by-user/:userId', protect, OrganizationController.getTeamMemberByUserId);
router.get('/team-members/:teamMemberId', protect, OrganizationController.getTeamMember);
router.patch('/team-members/:teamMemberId', protect, OrganizationController.updateTeamMember);
router.delete('/team-members/:teamMemberId', protect, OrganizationController.deleteTeamMember);

// Departments
router.get('/departments', protect, OrganizationController.getDepartments);
router.post('/departments', protect, OrganizationController.createDepartment);
router.get('/departments/:departmentId', protect, OrganizationController.getDepartment);
router.patch('/departments/:departmentId', protect, OrganizationController.updateDepartment);
router.delete('/departments/:departmentId', protect, OrganizationController.deleteDepartment);

// Email
router.post('/team-members/:teamMemberId/welcome', protect, OrganizationController.sendWelcomeEmail);
router.post('/team-members/:teamMemberId/reset', protect, OrganizationController.sendPasswordResetEmail);

export default router;
