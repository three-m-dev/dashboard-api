import { IInquiry, IInquiryDirectory } from "../interfaces/ICommon";
import db from "../models";

export class CustomerService {
  static async createInquiry(data: IInquiry): Promise<IInquiry> {
    const { firstName, lastName, company, phoneNumber, email, body } = data.message;

    type MessageKeys = keyof typeof data.message;
    const requiredFields: MessageKeys[] = ["firstName", "lastName", "company", "phoneNumber", "email", "body"];

    requiredFields.forEach((fieldName) => {
      if (!data.message[fieldName]) {
        throw new Error(`Missing required field: ${fieldName}`);
      }
    });

    const inquiry = await db.Inquiry.create({
      company: 1,
      message: {
        firstName,
        lastName,
        company,
        phoneNumber,
        email,
        body,
      },
    });

    return inquiry;
  }

  static async getInquiries(): Promise<IInquiryDirectory> {
    const inquiries = await db.Inquiry.findAll();

    const inquiryCount: number = inquiries.length;

    if (inquiryCount === 0) {
      throw new Error("No inquiries found");
    }

    return {
      inquiries: inquiries,
      count: inquiryCount,
    };
  }

  static async getInquiryById() {}

  static async updateInquiryById() {}

  static async deleteInquiryById() {}
}
