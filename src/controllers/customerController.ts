import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";

export class CustomerController {
  public static async createInquiry(req: Request, res: Response) {
    try {
      const newInquiry = await CustomerService.createInquiry(req.body);

      res.status(201).json(newInquiry);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getInquiries(req: Request, res: Response) {
    try {
      const inquires = await CustomerService.getInquiries();

      res.status(200).json(inquires);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
