import { Request, Response } from 'express';
import { EmailService } from '../services/email.service';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public createEmailSignature = async (req: Request, res: Response) => {
    try {
      const employeeId = req.params.employeeId;

      const response = await this.emailService.createEmailSignature(employeeId);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };
}
