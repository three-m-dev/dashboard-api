import { Router } from "express";
import { CameraController } from "../controllers/cameraController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", CameraController.createCamera);

router.get("/", protect);

router.get("/:cameraId", protect);

router.patch("/:cameraId", protect);

router.delete("/:cameraId", protect);

export default router;
