import { IInquiry, IInquiryDirectory } from "../interfaces/ICommon";
import db from "../models";

export class CustomerService {
  static async createInquiry(data: IInquiry): Promise<IInquiry> {
    const inquiry = await db.Inquiry.create(data);

    return inquiry;
  }

  static async getInquiries() {
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
