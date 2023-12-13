import { Router } from "express";
import { ApplicantController } from "../controllers/applicantController";
import { protect } from "../middleware/auth";

const router = Router();

const applicantController = new ApplicantController();

router.post("/", protect, applicantController.createApplicant);

router.get("/", protect, applicantController.getApplicants);

router.get("/:applicantId", protect, applicantController.getApplicant);

router.delete("/:applicantId", protect, applicantController.deleteApplicant);

export default router;
