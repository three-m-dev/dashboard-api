import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/inquiry/create", CustomerController.createInquiry);

router.get("/", protect, CustomerController.getInquiries);

router.get("/:inquiryId", protect);

router.patch("/:inquiryId", protect);

router.delete("/:inquiryId", protect);

export default router;
