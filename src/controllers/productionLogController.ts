import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/auth';
import { ProductionLogService } from '../services/productionLogService';
import { IQueryParams } from '../shared/interfaces';

export class ProductionLogController {
  public async createProductionLog(req: ExtendedRequest, res: Response) {
    try {
      const currentUserId = req.user.id;

      const productionLogData = req.body;

      const productionLogService = new ProductionLogService();

      const response = await productionLogService.createProductionLog(currentUserId, productionLogData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getProductionLogs(req: Request, res: Response) {
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

      const productionLogService = new ProductionLogService();

      const response = await productionLogService.getProductionLogs(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getProductionLog(req: Request, res: Response) {
    try {
      const productionLogId: string = req.params.productionLogId;

      const productionLogService = new ProductionLogService();

      const response = await productionLogService.getProductionLog(productionLogId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async updateProductionLog(req: Request, res: Response) {
    try {
      const productionLogId: string = req.params.productionLogId;

      console.log(req);

      const productionLogService = new ProductionLogService();

      const response = await productionLogService.updateProductionLog(productionLogId, req.body);

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
