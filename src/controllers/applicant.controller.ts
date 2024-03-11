import { Request, Response } from 'express';
import { ApplicantService } from '../services/applicant.service';
import { IApplicant, IQueryParams } from '../interfaces';

export class ApplicantController {
  private applicantService: ApplicantService;

  constructor() {
    this.applicantService = new ApplicantService();
  }

  public createApplicant = async (req: Request, res: Response) => {
    try {
      const { applicant: applicantData } = req.body;

      const response = await this.applicantService.createApplicant(applicantData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getApplicants = async (req: Request, res: Response) => {
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

      const response = await this.applicantService.getApplicants(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getApplicant = async (req: Request, res: Response) => {
    try {
      const applicantId: string = req.params.applicantId;

      const response = await this.applicantService.getApplicant(applicantId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateApplicant = async (req: Request, res: Response) => {
    try {
      const applicantId: string = req.params.applicantId;

      const { applicant: applicantData } = req.body;

      const response = await this.applicantService.updateApplicant(applicantId, applicantData);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public deleteApplicant = async (req: Request, res: Response) => {
    try {
      const applicantId: string = req.params.applicantId;

      const response = await this.applicantService.deleteApplicant(applicantId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };
}
