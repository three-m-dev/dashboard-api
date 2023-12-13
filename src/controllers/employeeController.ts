import { Request, Response } from 'express';
import { EmployeeService } from '../services/employeeService';
import { IQueryParams } from '../shared/interfaces';
import { ExtendedRequest } from '../middleware/auth';

export class EmployeeController {
	public async createEmployee(req: ExtendedRequest, res: Response) {
		try {
			const currentUserId = req.user.id;

			const { user: userData, employee: employeeData } = req.body;

			const employeeService = new EmployeeService();

			const response = await employeeService.createEmployee(currentUserId, employeeData, userData);

			res.status(201).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
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

			const employeeService = new EmployeeService();

			const response = await employeeService.getEmployees(params);

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

			const employeeService = new EmployeeService();

			const response = await employeeService.getEmployee(employeeId);

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

			const employeeService = new EmployeeService();

			const response = await employeeService.updateEmployee(employeeId, req.body);

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

			const employeeService = new EmployeeService();

			const response = await employeeService.deleteEmployee(employeeId);

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
