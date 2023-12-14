import { Request, Response } from 'express';
import { DepartmentService } from '../services/departmentService';
import { IQueryParams } from '../shared/interfaces';

export class DepartmentController {
	public async createDepartment(req: Request, res: Response) {
		try {
			const departmentData = req.body;

			console.log(departmentData);

			const departmentService = new DepartmentService();

			const response = await departmentService.createDepartment(departmentData);

			res.status(201).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getDepartments(req: Request, res: Response) {
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

			const departmentService = new DepartmentService();

			const response = await departmentService.getDepartments(params);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getDepartment(req: Request, res: Response) {
		try {
			const departmentId: string = req.params.departmentId;

			const departmentService = new DepartmentService();

			const response = await departmentService.getDepartment(departmentId);

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
