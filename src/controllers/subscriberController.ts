import { Request, Response } from 'express';
import { SubscriberService } from '../services/subscriberService';

export class SubscriberController {
	public static async createSubscriber(req: Request, res: Response) {
		try {
			const newSubscriber = await SubscriberService.createSubscriber(req.body);

			res.status(201).json(newSubscriber);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
