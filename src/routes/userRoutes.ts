import { Router } from "express";
import { UserController } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:userId", protect, UserController.getUserById);

router.get("/", protect, UserController.getUsers);

router.post("/create", protect, UserController.createUser);

router.post("/auth", UserController.authUser);

export default router;
