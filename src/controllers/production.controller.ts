import { Request, Response } from 'express';
import { ProductionService } from '../services/production.service';
import { IQueryParams } from '../interfaces';

export class ProductionController {
  private productionService: ProductionService;

  constructor() {
    this.productionService = new ProductionService();
  }

  public createProductionLog = async (req: Request, res: Response) => {
    try {
      const productionLogData = req.body;

      const response = await this.productionService.createProductionLog(productionLogData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getProductionLogs = async (req: Request, res: Response) => {
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

      const response = await this.productionService.getProductionLogs(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getProductionLog = async (req: Request, res: Response) => {
    try {
      const productionLogId: string = req.params.productionLogId;

      const response = await this.productionService.getProductionLog(productionLogId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateProductionLog = async (req: Request, res: Response) => {};

  public deleteProductionLog = async (req: Request, res: Response) => {};
}
