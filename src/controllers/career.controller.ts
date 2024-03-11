import { Request, Response } from 'express';
import { CareerService } from '../services/career.service';
import { IQueryParams } from '../interfaces';

export class CareerController {
  private careerService: CareerService;

  constructor() {
    this.careerService = new CareerService();
  }

  public createCareer = async (req: Request, res: Response) => {
    try {
      const { career: careerData } = req.body;

      const response = await this.careerService.createCareer(careerData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getCareers = async (req: Request, res: Response) => {
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

      const response = await this.careerService.getCareers(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getCareer = async (req: Request, res: Response) => {
    try {
      const careerId: string = req.params.careerId;

      const response = await this.careerService.getCareer(careerId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateCareer = async (req: Request, res: Response) => {
    try {
      const careerId: string = req.params.careerId;

      const response = await this.careerService.updateCareer(careerId, req.body);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public deleteCareer = async (req: Request, res: Response) => {
    try {
      const careerId: string = req.params.careerId;

      const response = await this.careerService.deleteCareer(careerId);

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
