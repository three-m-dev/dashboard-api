import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create/:userId", protect, EmployeeController.createEmployee);

router.post("/:employeeId/welcome", protect, EmployeeController.sendWelcomeEmail);

router.post("/:employeeId/reset", protect, EmployeeController.sendPasswordResetEmail);

router.get("/", protect, EmployeeController.getEmployees);

router.get("/:employeeId", protect, EmployeeController.getEmployeeById);

router.patch("/:employeeId", protect);

router.delete("/:employeeId", protect);

export default router;
