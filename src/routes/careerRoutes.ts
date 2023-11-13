import { Router } from "express";
import { CareerController } from "../controllers/careerController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Job Listing
router.post("/listings/create", protect, CareerController.createJobListing);

router.get("/listings/", protect, CareerController.getJobListings);

router.get("/listings/:jobListingId", protect, CareerController.getJobListingById);

router.patch("/listings/:jobListingId", protect);

router.delete("/listings/:jobListingId", protect);

// Job Application
router.post("/applications/create/:jobListingId", CareerController.createJobApplication);

router.get("/applications/", protect, CareerController.getJobApplications);

router.get("/applications/:jobApplicationId", protect);

router.patch("/applications/:jobApplicationId", protect);

router.delete("/applications/:jobApplicationId", protect);

// Resume
router.post("/resumes/create", CareerController.createResume);

export default router;
