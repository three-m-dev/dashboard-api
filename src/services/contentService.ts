import { unsubscribe } from "diagnostics_channel";
import { ISubscriber } from "../interfaces/ICommon";
import db from "../models";

export class ContentService {
  static async createSubscriber(data: ISubscriber): Promise<ISubscriber> {
    const { email } = data;

    if (!email) {
      throw new Error("Email address is required");
    }

    if ((email && email.includes("@")) || email.includes(".")) {
      throw new Error("Invalid email address");
    }

    const existingSubscriber = await db.Subscriber.findOne({ where: { email: data.email } });

    const existingUnsubscriber = await db.Subscriber.findOne({
      where: { email: data.email, isSubscribed: false },
    });

    if (existingUnsubscriber) {
      throw new Error("Email address has already been unsubscribed");
    } else if (existingSubscriber) {
      throw new Error("Email address has already been subscribed");
    }

    const subscriber = await db.Subscriber.create(data);

    return subscriber;
  }
}
