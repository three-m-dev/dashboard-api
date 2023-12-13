import bcrypt from 'bcryptjs';
import db from '../models';
import { IQueryParams, IEmployee, IUser } from '../shared/interfaces';
import { UserService } from './userService';

export class EmployeeService {
	private userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	public async createEmployee(currentUserId: string, employeeData: IEmployee, userData: IUser) {
		const t = await db.sequelize.transaction();

		try {
			const currentUser = await db.Employee.findOne({ where: { userId: currentUserId } });

			if (!currentUser) {
				throw new Error('Current user not found');
			}

			if (!userData.username || !userData.password) {
				throw new Error('Username and password are required');
			}

			if (userData.password.length < 6) {
				throw new Error('Password must be at least 6 characters');
			}

			const existingUser = await db.User.findOne({ where: { username: userData.username } }, { transaction: t });

			if (existingUser) {
				throw new Error('Username already exists');
			}

			if (!employeeData.firstName || !employeeData.lastName) {
				throw new Error('First and last name are required');
			}

			if (!employeeData.title) {
				throw new Error('Title is required');
			}

			if (!employeeData.departmentId) {
				throw new Error('Department is required');
			}

			if (!employeeData.directReportId) {
				throw new Error('Direct report is required');
			}

			// const directReport = await db.Employee.findOne({ where: { id: employeeData.directReportId } });

			// if (!directReport) {
			// 	throw new Error('Direct report not found');
			// }

			if (!employeeData.type) {
				throw new Error('Type is required');
			}

			if (!employeeData.status) {
				throw new Error('Status is required');
			}

			if (!employeeData.startDate) {
				throw new Error('Start date is required');
			}

			if (employeeData.endDate && employeeData.startDate > employeeData.endDate) {
				throw new Error('End date must be after start date');
			}

			const hashedPassword = await bcrypt.hash(userData.password, 10);

			const user = await db.User.create({ ...userData, password: hashedPassword }, { transaction: t });

			const { password: userPassword, ...userWithoutPassword } = user.get({ plain: true });

			const existingEmployee = await db.Employee.findAll(
				{
					where: { userId: user.id },
				},
				{ transaction: t }
			);

			if (existingEmployee.length > 0) {
				throw new Error('User already associated with an team member');
			}

			if (!user) {
				throw new Error('Error creating user');
			}

			const employee = await db.Employee.create(
				{ ...employeeData, userId: user.id, createdBy: currentUserId },
				{ transaction: t }
			);

			await t.commit();
			return { user: userWithoutPassword, employee };
		} catch (error) {
			await t.rollback();
			throw error;
		}
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

		if (page && pageSize) {
			limit = pageSize;
			offset = (page - 1) * pageSize;
		}

		const employees = await db.Employee.findAll({
			where: whereClause,
			order: orderClause,
			limit,
			offset,
			attributes,
		});

		const total = await db.Employee.count({ where: whereClause });

		const pages = limit ? Math.ceil(total / limit) : 0;

		return { employees, total, pages };
	}

	public async getEmployee(employeeId: string) {
		const employee = await db.Employee.findOne({ where: { id: employeeId } });

		if (!employee) {
			throw new Error('Employee not found');
		}

		return employee;
	}

	public async updateEmployee(employeeId: string, updates: Partial<IUser>) {
		const restrictedFields = ['id', 'createdAt', 'createdBy', 'userId'];

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

		return employee;
	}
}
