import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/authMiddleware';
import { CareerService } from '../services/careerService';
import { v4 as uuidv4 } from 'uuid';

export class CareerController {
	public static async createCareerListing(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const careerListing = await CareerService.createCareerListing(currentUser, req.body);

			res.status(201).json(careerListing);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getCareerListings(req: Request, res: Response) {
		try {
			const careerListings = await CareerService.getCareerListings();

			res.status(200).json(careerListings);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getCareerListingById(req: Request, res: Response) {
		try {
			const careerListingId: string = req.params.careerListingId;

			const careerListing = await CareerService.getCareerListingById(careerListingId);

			res.status(200).json(careerListing);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async createCareerApplication(req: ExtendedRequest, res: Response) {
		try {
			const careerListingId = req.params.careerListingId;

			const careerApplication = await CareerService.createCareerApplication(careerListingId, req.body);

			res.status(201).json(careerApplication);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getCareerApplications(req: Request, res: Response) {
		try {
			const careerApplications = await CareerService.getCareerApplications();

			res.status(200).json(careerApplications);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
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
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
