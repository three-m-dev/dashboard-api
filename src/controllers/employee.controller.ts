import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { IQueryParams } from '../shared/interfaces';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public async getEmployees(req: Request, res: Response) {
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

      const response = await this.employeeService.getEmployees(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async getEmployee(req: Request, res: Response) {
    try {
      const employeeId: string = req.params.employeeId;

      const response = await this.employeeService.getEmployee(employeeId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async updateEmployee(req: Request, res: Response) {
    try {
      const employeeId: string = req.params.employeeId;

      const response = await this.employeeService.updateEmployee(employeeId, req.body);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  public async deleteEmployee(req: Request, res: Response) {
    try {
      const employeeId: string = req.params.employeeId;

      const response = await this.employeeService.deleteEmployee(employeeId);

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
