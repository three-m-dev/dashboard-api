import { IEmployee } from '../interfaces';
import db from '../models';
import { IQueryParams, IUser } from '../shared/interfaces';

export class EmployeeService {
	public async createEmployee(employeeData: IEmployee, accountId: string, txn?: any) {
		const requiredFields = ['firstName', 'lastName', 'company', 'department', 'title', 'status', 'startDate'];

		for (const field of requiredFields) {
			if (!employeeData[field as keyof IEmployee]) {
				throw new Error(`${field} is required`);
			}
		}

		if (employeeData.endDate && employeeData.startDate > employeeData.endDate) {
			throw new Error('End date must be after start date');
		}

		const employee = await db.Employee.create({ ...employeeData, accountId }, { transaction: txn });

		return employee;
	}

	public async getEmployees(params: IQueryParams) {
		const { filter, sort, page, pageSize, fields } = params;

		let whereClause = filter || {};
		let orderClause: [string, string][] = [];
		let limit = pageSize;
		let offset = page && pageSize ? (page - 1) * pageSize : 0;
		let attributes: string[] | undefined = fields;

		if (sort) {
			const [field, order] = sort.split(',');
			orderClause.push([field, order.toUpperCase()]);
		}

		const employees = await db.Employee.findAll({
			where: whereClause,
			order: orderClause,
			limit,
			offset,
			attributes,
		});

		const total = await db.Employee.count({
			where: whereClause,
		});

		const pages = limit ? Math.ceil(total / limit) : 0;

		return { employees, total, pages };
	}

	public async getEmployee(employeeId: string) {
		const employee = await db.Employee.findOne({
			where: { id: employeeId },
		});

		if (!employee) {
			throw new Error('Employee not found');
		}

		return employee;
	}

	public async updateEmployee(employeeId: string, updates: Partial<IUser>) {
		const restrictedFields = ['id', 'createdAt', 'createdBy', 'accountId'];

		for (const field of restrictedFields) {
			if (updates[field as keyof IUser] !== undefined) {
				throw new Error(`Field '${field}' cannot be updated`);
			}
		}

		const employee = await db.Employee.findOne({ where: { id: employeeId } });

		if (!employee) {
			throw new Error('Employee not found');
		}

		Object.assign(employee, updates);

		await employee.save();

		return { employee };
	}

	public async deleteEmployee(employeeId: string) {
		const employee = await db.Employee.findOne({ where: { id: employeeId } });

		if (!employee) {
			throw new Error('Employee not found');
		}

		await employee.destroy();

		return;
	}
}
