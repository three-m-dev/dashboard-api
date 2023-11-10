import { Request, Response } from 'express';
import { JobApplicationService } from '../services/jobApplicationService';
import { ExtendedRequest } from '../middleware/authMiddleware';

export class JobApplicationController {
	public static async createJobApplication(req: ExtendedRequest, res: Response) {
		try {
			const jobListingId = req.params.jobListingId;

			const newApplication = await JobApplicationService.createJobApplication(jobListingId, req.body);

			res.status(201).json(newApplication);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getJobApplications(req: Request, res: Response) {
		try {
			const jobApplications = await JobApplicationService.getJobApplications();

			res.status(200).json(jobApplications);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
