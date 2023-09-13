import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createUser, authUser, getUsers } from "../controllers/employee";

const router = Router();

router.get("/", protect, getUsers);

router.post("/create", createUser);

router.post("/auth", authUser);

export default router;
