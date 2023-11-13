import { Router } from "express";
import { CameraController } from "../controllers/cameraController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", protect, CameraController.createCamera);

router.get("/:cameraId/validate", protect, CameraController.validateConnection);

router.get("/", protect);

router.get("/:cameraId", protect);

router.patch("/:cameraId", protect);

router.delete("/:cameraId", protect);

export default router;
