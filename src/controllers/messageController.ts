import { Request, Response } from 'express';
import { MessageService } from '../services/messageService';

export class MessageController {
	public static async createMessage(req: Request, res: Response) {
		try {
			const newMessage = await MessageService.createMessage(req.body);

			res.status(201).json(newMessage);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getMessages(req: Request, res: Response) {
		try {
			const messages = await MessageService.getMessages();

			res.status(200).json(messages);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
