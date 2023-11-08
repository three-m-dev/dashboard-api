import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create/:userId", protect, EmployeeController.createEmployee);

router.get("/", protect, EmployeeController.getEmployees);

export default router;
