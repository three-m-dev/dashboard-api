import { Router } from "express";
import { TeamController } from "../controllers/teamController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Authentication routes
router.post("/team-member/auth", TeamController.authUser);
router.post("/team-member/logout", protect, TeamController.logoutUser);
router.get("/team-member/session", protect, TeamController.validateSession);

// User routes
router.get("/users", protect, TeamController.getUsers);
router.get("/user/:userId", protect, TeamController.getUserById);

// Employee routes
router.get("/team-members", protect, TeamController.getTeamMembers);
router.get("/team-member/:teamMemberId", protect, TeamController.getTeamMemberById);

// Transaction routes
router.post("/team-member", protect, TeamController.createProfile);

// Department Routes
router.post("/departments", protect, TeamController.createDepartment);
router.get("/departments", protect, TeamController.getDepartments);

// Email routes
router.post("/team-member/:teamMemberId/welcome", protect, TeamController.sendWelcomeEmail);
router.post("/team-member/:teamMemberId/reset", protect, TeamController.sendPasswordResetEmail);

export default router;
