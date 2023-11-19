import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validate } from 'uuid';
import {
	IEmployee,
	IEmployeeDirectory,
	IUser,
	IUserDirectory,
	IUserParams,
	IUserWithoutPassword,
} from '../interfaces/ICommon';
import db from '../models';

export class TeamService {
	// Create New User
	static async createUser(
		createdById: string,
		data: IUser,
		options: { transaction?: Transaction } = {}
	): Promise<IUserWithoutPassword> {
		const requiredFields = ['username', 'password', 'accountType'] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const existingUser = await db.User.findAll({
			where: { username: data.username },
		});

		if (existingUser.length > 0) {
			throw new Error('Username already exists');
		}

		const hashedPassword = await bcrypt.hash(data.password, 10);

		const user = await db.User.create({
			...data,
			password: hashedPassword,
			createdBy: createdById,
			updatedBy: createdById,
		});

		const { password, ...userWithoutPassword } = user.get({ plain: true });

		return userWithoutPassword;
	}

	// Create New Employee
	static async createEmployee(
		createdById: string,
		userId: string,
		data: IEmployee,
		options: { transaction?: Transaction } = {}
	): Promise<IEmployee> {
		const user = await db.User.findByPk(userId, { transaction: options.transaction });

		if (user === null) {
			throw new Error('User does not exist');
		}

		const existingEmployee = await db.Employee.findAll({
			where: { userId: userId },
			transaction: options.transaction,
		});

		if (existingEmployee.length > 0) {
			throw new Error('User already associated with an employee');
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

		const employee = await db.Employee.create(
			{
				...data,
				userId: userId,
				createdBy: createdById,
				updatedBy: createdById,
			},
			{ transaction: options.transaction }
		);

		return employee;
	}

	// Create New Team Member (User + Employee)
	static async createTeamMember(createdById: string, userData: IUser, employeeData: IEmployee): Promise<any> {
		return db.sequelize.transaction(async (transaction: Transaction) => {
			const user = await this.createUser(createdById, userData, { transaction });

			let employee = null;
			if (userData.accountType !== 'developer') {
				employee = await this.createEmployee(createdById, user.id, employeeData, { transaction });
			}

			return { user, employee };
		});
	}

	// Authenticate User
	public static async authUser(username: string, password: string): Promise<{ accessToken: string }> {
		if (!username || !password) {
			throw new Error('Missing credentials');
		}

		const user = await db.User.findOne({ where: { username } });
		if (!user) {
			throw new Error('User not found');
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) {
			throw new Error('Invalid password');
		}

		const accessToken = sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
			expiresIn: '24h',
		});

		return { accessToken };
	}

	static async getUsers(params: IUserParams): Promise<IUserDirectory> {
		const { accountType, isActive } = params;

		const isActiveBoolean = isActive ? isActive === 'true' : undefined;

		let whereConditions: any = {};

		if (accountType) {
			whereConditions.accountType = accountType;
		}

		if (isActiveBoolean !== undefined) {
			whereConditions.isActive = isActiveBoolean;
		}

		const users = await db.User.findAll({
			attributes: { exclude: ['password'] },
			where: whereConditions,
			order: [['username', 'ASC']],
		});

		const userCount = users.length;

		if (userCount === 0) {
			throw new Error('No users found');
		}

		return {
			users: users,
			count: userCount,
		};
	}

	static async getUserById(userId: string): Promise<IUserWithoutPassword> {
		if (!validate(userId)) {
			throw new Error('Invalid search criteria');
		}

		if (userId === null) {
			throw new Error('User ID is required');
		}

		const user = await db.User.findByPk(userId);

		if (user === null) {
			throw new Error('No user found');
		}

		const { password, ...userWithoutPassword } = user.get({ plain: true });

		return userWithoutPassword;
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
