import { Router } from "express";
import { JobListingController } from "../controllers/jobListingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:jobListingId", protect, JobListingController.getJobListingById);

router.post("/create", protect, JobListingController.createJobListing);

router.get("/", protect, JobListingController.getJobListings);

export default router;
