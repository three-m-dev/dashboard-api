import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
import { IQueryParams } from '../shared/interfaces';

export class ApplicationController {
  public async createApplication(req: Request, res: Response) {
    try {
      const { applicant: applicantData, application: applicationData } = req.body;

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

  public async getApplications(req: Request, res: Response) {
    try {
      const { filter, sort, page, pageSize, fields } = req.query;

      const pageNumber = page ? parseInt(page as string) : undefined;
      const pageSizeNumber = pageSize ? parseInt(pageSize as string) : undefined;

      const fieldsArray = typeof fields === 'string' ? fields.split(',') : fields;

      const params: IQueryParams = {
        filter: filter ? JSON.parse(filter as string) : undefined,
        sort: sort as string | undefined,
        page: pageNumber,
        pageSize: pageSizeNumber,
        fields: fieldsArray as string[] | undefined,
      };

      const applicationService = new ApplicationService();

      const response = await applicationService.getApplications(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getApplication(req: Request, res: Response) {
    try {
      const applicationId: string = req.params.applicationId;

      console.log(applicationId);

      const applicationService = new ApplicationService();

      const response = await applicationService.getApplication(applicationId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
