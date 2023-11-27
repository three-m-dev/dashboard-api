import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/inquiries/create", CustomerController.createInquiry);

router.get("/inquiries/", protect, CustomerController.getInquiries);

router.get("/inquiries/:inquiryId", protect);

router.patch("/inquiries/:inquiryId", protect);

router.delete("/inquiries/:inquiryId", protect);

export default router;
