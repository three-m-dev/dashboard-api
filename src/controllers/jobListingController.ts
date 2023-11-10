import { Request, Response } from 'express';
import { JobListingService } from '../services/jobListingService';
import { ExtendedRequest } from '../middleware/authMiddleware';

export class JobListingController {
	public static async createJobListing(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const newListing = await JobListingService.createJobListing(currentUser, req.body);

			res.status(201).json(newListing);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getJobListings(req: Request, res: Response) {
		try {
			const jobListings = await JobListingService.getJobListings();

			res.status(200).json(jobListings);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getJobListingById(req: Request, res: Response) {
		try {
			const jobListingId: string = req.params.jobListingId;

			const jobListing = await JobListingService.getJobListingById(jobListingId);

			res.status(200).json(jobListing);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
