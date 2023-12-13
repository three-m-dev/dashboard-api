import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
import { IQueryParams } from '../shared/interfaces';

export class ApplicationController {
  public async createApplication(req: Request, res: Response) {
    try {
      const { applicant: applicantData, application: applicationData } = req.body;

      console.log(req.body);

      const applicationService = new ApplicationService();

      const response = await applicationService.createApplication(applicantData, applicationData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
