import { IMessage, IMessageDirectory } from '../interfaces/ICommon';
import db from '../models';

export class MessageService {
	static async createMessage(messageData: IMessage): Promise<IMessage> {
		const message = await db.Message.create(messageData);

		return message;
	}

	static async getMessages(): Promise<IMessageDirectory> {
		const messages = await db.Message.findAll();

		const messageCount: number = messages.length;

		if (messageCount === 0) {
			throw new Error('No messages found');
		}

		return {
			messages: messages,
			count: messageCount,
		};
	}
}
