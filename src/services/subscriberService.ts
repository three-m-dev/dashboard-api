import { ISubscriber } from '../interfaces/ICommon';
import db from '../models';

export class SubscriberService {
	static async createSubscriber(subscriberData: ISubscriber): Promise<ISubscriber> {
		if (!subscriberData.email) {
			throw new Error('Email address is required');
		}

		if ((subscriberData.email && !subscriberData.email.includes('@')) || !subscriberData.email.includes('.')) {
			throw new Error('Invalid email address');
		}

		const existingSubscriber = await db.Subscriber.findOne({ where: { email: subscriberData.email } });

		const existingUnsubscriber = await db.Subscriber.findOne({
			where: { email: subscriberData.email, isSubscribed: false },
		});

		if (existingUnsubscriber) {
			throw new Error('Email address has already been unsubscribed');
		} else if (existingSubscriber) {
			throw new Error('Email address has already been subscribed');
		}

		const subscriber = await db.Subscriber.create(subscriberData);

		return subscriber;
	}
}
