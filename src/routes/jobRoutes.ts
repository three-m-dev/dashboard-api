import { Router } from "express";
import { JobController } from "../controllers/jobController";
import { protect } from "../middleware/auth";

const router = Router();

const jobController = new JobController();

router.post("/", protect, jobController.createJob);

router.get("/", protect, jobController.getJobs);

router.get("/:jobId", protect, jobController.getJob);

router.patch("/:jobId", protect, jobController.updateJob);

router.delete("/:jobId", protect, jobController.deleteJob);

export default router;
