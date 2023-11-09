import { IEmployee, IEmployeeDirectory } from '../interfaces/ICommon';
import db from '../models';

export class EmployeeService {
	static async createEmployee(userId: string, employeeData: IEmployee): Promise<IEmployee> {
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
			'hireDate',
			'role',
			'department',
			'directReport',
			'employmentStatus',
		] as const;

		const missingField = requiredFields.find((field) => !employeeData[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const employee = await db.Employee.create({
			employeeId: employeeData.employeeId,
			userId: userId,
			firstName: employeeData.firstName,
			middleInitial: employeeData.middleInitial,
			lastName: employeeData.lastName,
			email: employeeData.email,
			phoneNumber: employeeData.phoneNumber,
			address: employeeData.address,
			dateOfBirth: employeeData.dateOfBirth,
			hireDate: employeeData.hireDate,
			role: employeeData.role,
			department: employeeData.department,
			directReport: employeeData.directReport,
			employmentStatus: employeeData.employmentStatus,
			salary: employeeData.salary,
			endDate: employeeData.endDate,
			notes: employeeData.notes,
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
