import { IInquiry, IInquiryDirectory } from "../shared/interfaces";
import db from "../models";

export class CustomerService {
  static async createInquiry(data: IInquiry): Promise<IInquiry> {
    const { name, company, email, subject, body } = data.message;

    const requiredFields = [
      { fieldName: "name", value: name },
      { fieldName: "company", value: company },
      { fieldName: "email", value: email },
      { fieldName: "subject", value: subject },
      { fieldName: "body", value: body },
    ];

    requiredFields.forEach((field) => {
      if (!field.value) {
        throw new Error(`Missing required field: ${field.fieldName}`);
      }
    });

    const inquiry = await db.Inquiry.create({
      company: 1,
      message: {
        name,
        company,
        email,
        subject,
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
