import { IEmployee, IEmployeeDirectory } from '../interfaces/ICommon';
import db from '../models';

export class EmployeeService {
	static async createEmployee(createdById: string, userId: string, data: IEmployee): Promise<IEmployee> {
		const user = await db.User.findByPk(userId);

		if (user === null) {
			throw new Error('User does not exist');
		}

		const existingEmployee = await db.Employee.findAll({
			where: { userId: userId },
		});

		if (existingEmployee.length > 0) {
			throw new Error('User already associated with employee');
		}

		const requiredFields = [
			'firstName',
			'lastName',
			'email',
			'company',
			'department',
			'role',
			'directReport',
			'status',
			'hiredAt',
		] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const employee = await db.Employee.create({
			...data,
			userId: userId,
			createdBy: createdById,
			updatedBy: createdById,
		});

		return employee;
	}

	static async getEmployees(): Promise<IEmployeeDirectory> {
		const employees = await db.Employee.findAll({
			order: [['lastName', 'ASC']],
		});

		const employeeCount: number = employees.length;

		if (employeeCount === 0) {
			throw new Error('No employees found');
		}

		return {
			employees: employees,
			count: employeeCount,
		};
	}

	static async getEmployeeById(employeeId: string): Promise<IEmployee> {
		if (employeeId === null) {
			throw new Error('Invalid search criteria');
		}

		const employee = await db.Employee.findByPk(employeeId);

		if (employee === null) {
			throw new Error('No employee found');
		}

		return employee;
	}
}
