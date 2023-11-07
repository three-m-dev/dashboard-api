import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

router.post("/create", UserController.createUser);

router.post("/auth", UserController.authUser);

router.get("/", UserController.getUsers);

export default router;
