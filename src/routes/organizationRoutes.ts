import { Router } from "express";
import { OrganizationController } from "../controllers/organizationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Authentication
router.post("/auth", OrganizationController.authUser);
router.post("/logout", protect, OrganizationController.logoutUser);
router.get("/session", protect, OrganizationController.validateSession);

// Users
router.get("/users", protect, OrganizationController.getUsers);
router.get("/users/:userId", protect, OrganizationController.getUser);
router.patch("/users/:userId", protect, OrganizationController.updateUser);
router.delete("/users/:userId", protect, OrganizationController.deleteUser);

// Team Members
router.post("/team-members", protect, OrganizationController.createTeamMember);
router.get("/team-members", protect, OrganizationController.getTeamMembers);
router.get("/team-members/:teamMemberId", protect, OrganizationController.getTeamMember);
router.patch("/team-members/:teamMemberId", protect, OrganizationController.updateTeamMember);
router.delete("/team-members/:teamMemberId", protect, OrganizationController.deleteTeamMember);

// Departments
router.post("/departments", protect, OrganizationController.createDepartment);
router.get("/departments", protect, OrganizationController.getDepartments);
router.get("/departments/:departmentId", protect, OrganizationController.getDepartment);
router.patch("/departments/:departmentId", protect, OrganizationController.updateDepartment);
router.delete("/departments/:departmentId", protect, OrganizationController.deleteDepartment);

// Email
router.post("/team-members/:teamMemberId/welcome", protect, OrganizationController.sendWelcomeEmail);
router.post("/team-members/:teamMemberId/reset", protect, OrganizationController.sendPasswordResetEmail);

export default router;
