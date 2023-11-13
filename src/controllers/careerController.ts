import { Request, Response } from "express";
import { CareerService } from "../services/careerService";
import { ExtendedRequest } from "../middleware/authMiddleware";

import { v4 as uuidv4 } from "uuid";

export class CareerController {
  public static async createJobListing(req: ExtendedRequest, res: Response) {
    try {
      const currentUser = req.user.id;

      const newListing = await CareerService.createJobListing(currentUser, req.body);

      res.status(201).json(newListing);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getJobListings(req: Request, res: Response) {
    try {
      const jobListings = await CareerService.getJobListings();

      res.status(200).json(jobListings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getJobListingById(req: Request, res: Response) {
    try {
      const jobListingId: string = req.params.jobListingId;

      const jobListing = await CareerService.getJobListingById(jobListingId);

      res.status(200).json(jobListing);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async createJobApplication(req: ExtendedRequest, res: Response) {
    try {
      const jobListingId = req.params.jobListingId;

      const newApplication = await CareerService.createJobApplication(jobListingId, req.body);

      res.status(201).json(newApplication);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getJobApplications(req: Request, res: Response) {
    try {
      const jobApplications = await CareerService.getJobApplications();

      res.status(200).json(jobApplications);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async createResume(req: Request, res: Response) {
    try {
      const fakeUUID = uuidv4();

      const resume = await CareerService.createResume(fakeUUID, req.body);

      res.status(200).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
