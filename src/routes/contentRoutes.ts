import { Router } from "express";
import { ContentController } from "../controllers/contentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/subscribers/create", ContentController.createSubscriber);

router.get("/subscribers", protect);

router.get("/:subscriberId", protect);

router.patch("/:subscriberId", protect);

router.delete("/:subscriberId", protect);

export default router;
