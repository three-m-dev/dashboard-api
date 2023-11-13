import { Router } from "express";
import { MessageController } from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", MessageController.createMessage);

router.get("/", protect, MessageController.getMessages);

router.get("/:messageId", protect);

router.patch("/:messageId", protect);

router.delete("/:messageId", protect);

export default router;
