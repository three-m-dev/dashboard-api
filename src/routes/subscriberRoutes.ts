import { Router } from "express";
import { SubscriberController } from "../controllers/subscriberController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", SubscriberController.createSubscriber);

router.get("/", protect);

router.get("/:subscriberId", protect);

router.patch("/:subscriberId", protect);

router.delete("/:subscriberId", protect);

export default router;
