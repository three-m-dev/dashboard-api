import { Request, Response } from 'express';
import { DowntimeService } from '../services/downtimeService';
import { ExtendedRequest } from '../middleware/auth';
import { IQueryParams } from '../shared/interfaces';

export class DowntimeController {
  public async createDowntimeEntry(req: ExtendedRequest, res: Response) {
    try {
      const currentUserId = req.user.id;

      const downtimeData = req.body;

      const downtimeService = new DowntimeService();

      const response = await downtimeService.createdDowntimeEntry(currentUserId, downtimeData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getDowntimeEntries(req: Request, res: Response) {
    try {
      const { filter, sort, page, pageSize, fields } = req.query;

      console.log(filter);

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

      const downtimeService = new DowntimeService();

      const response = await downtimeService.getDowntimeEntries(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getDowntimeEntry(req: Request, res: Response) {
    try {
      const downtimeEntryId: string = req.params.downtimeEntryId;

      const downtimeService = new DowntimeService();

      const response = await downtimeService.getDowntimeEntry(downtimeEntryId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async generateDowntimeReport(req: Request, res: Response) {
    try {
      const { filter } = req.query;

      const params: IQueryParams = {
        filter: filter ? JSON.parse(filter as string) : undefined,
      };

      const downtimeService = new DowntimeService();

      const report = await downtimeService.generateDowntimeReport(params);

      res.status(200).json(report);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
