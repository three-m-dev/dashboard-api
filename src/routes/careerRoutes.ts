import { Router } from "express";
import { CareerController } from "../controllers/careerController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Careers
router.post("/", protect, CareerController.createCareer);
router.get("/", CareerController.getCareers);
router.get("/:careerId", protect, CareerController.getCareer);
router.patch("/:careerId", protect, CareerController.updateCareer);
router.delete("/:careerId", protect, CareerController.deleteCareer);

// Career Applications
router.post("/applications/:careerId", protect, CareerController.createApplication);
router.get("/applications", protect, CareerController.getApplications);
router.get("/applications/:applicationId", protect, CareerController.getApplication);
router.patch("/applications/:applicationId", protect, CareerController.updateApplication);
router.delete("/applications/:applicationId", protect, CareerController.deleteApplication);

// Resume
router.post("/resumes", CareerController.createResume);
router.get("/resumes", CareerController.getResumes);
router.get("/resumes/:resumeId", CareerController.getResume);
router.patch("/resumes/:resumeId", CareerController.updateResume);
router.delete("/resumes/:resumeId", CareerController.deleteResume);

export default router;
