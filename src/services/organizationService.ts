import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validate } from 'uuid';
import {
	IDepartment,
	IDepartmentDirectory,
	ITeamMember,
	ITeamMemberDirectory,
	IUser,
	IUserDirectory,
	IUserParams,
	IUserWithoutPassword,
} from '../interfaces/ICommon';
import db from '../models';

export class OrganizationService {
	static async createUser(
		createdById: string,
		data: IUser,
		options: { transaction?: Transaction } = {}
	): Promise<IUserWithoutPassword> {
		const { username, password, accountType } = data;

		const requiredFields = [username, password, accountType];

		requiredFields.forEach((field) => {
			if (!field) {
				throw new Error(`Missing required field ${field}`);
			}
		});

		const existingUser = await db.User.findOne({
			where: { username: username },
		});

		if (existingUser) {
			throw new Error(`User with the username ${username} already exists`);
		}

		if (password.length < 8) {
			throw new Error('Password must be at least 8 characters long');
		}

		if (password.length > 20) {
			throw new Error('Password cannot be more than 20 characters long');
		}

		if (password.search(/[a-z]/i) < 0) {
			throw new Error('Password must contain at least one letter');
		}

		if (password.search(/[0-9]/) < 0) {
			throw new Error('Password must contain at least one number');
		}

		if (password.search(/[!@#$%^&*]/) < 0) {
			throw new Error('Password must contain at least one special character');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		if (accountType === 'developer') {
			const existingDeveloper = await db.User.findOne({
				where: { accountType: 'developer' },
			});

			if (existingDeveloper) {
				throw new Error(`Developer already exists`);
			}
		}

		const user = await db.User.create({
			...data,
			password: hashedPassword,
			createdBy: createdById,
			updatedBy: createdById,
		});

		const { password: userPassword, ...userWithoutPassword } = user.get({ plain: true });

		return userWithoutPassword;
	}

	static async createTeamMember(
		createdById: string,
		userId: string,
		data: ITeamMember,
		options: { transaction?: Transaction } = {}
	): Promise<ITeamMember> {
		const user = await db.User.findByPk(userId, { transaction: options.transaction });

		if (user === null) {
			throw new Error('User does not exist');
		}

		const existingTeamMember = await db.TeamMember.findAll({
			where: { userId: userId },
			transaction: options.transaction,
		});

		if (existingTeamMember.length > 0) {
			throw new Error('User already associated with an team member');
		}

		const requiredFields = [
			'firstName',
			'lastName',
			'email',
			'company',
			'department',
			'role',
			'directReport',
			'type',
			'hiredAt',
		] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const teamMember = await db.TeamMember.create(
			{
				...data,
				userId: userId,
				createdBy: createdById,
				updatedBy: createdById,
			},
			{ transaction: options.transaction }
		);

		return teamMember;
	}

	static async createUserAndTeamMember(
		createdById: string,
		userData: IUser,
		teamMemberData: ITeamMember
	): Promise<any> {
		return db.sequelize.transaction(async (transaction: Transaction) => {
			const user = await this.createUser(createdById, userData, { transaction });

			let teamMember = null;
			if (userData.accountType !== 'developer') {
				teamMember = await this.createTeamMember(createdById, user.id, teamMemberData, { transaction });
			}

			return { user, teamMember };
		});
	}

	static async authUser(username: string, password: string): Promise<{ accessToken: string }> {
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
			throw new Error('User ID is invalid');
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

	static async getTeamMembers(): Promise<ITeamMemberDirectory> {
		const teamMembers = await db.TeamMember.findAll({
			order: [['firstName', 'ASC']],
		});

		const teamMemberCount: number = teamMembers.length;

		if (teamMemberCount === 0) {
			throw new Error('No team members found');
		}

		return {
			teamMembers: teamMembers,
			count: teamMemberCount,
		};
	}

	static async getTeamMemberById(teamMemberId: string): Promise<ITeamMember> {
		if (teamMemberId === null) {
			throw new Error('Invalid search criteria');
		}

		const teamMember = await db.TeamMember.findByPk(teamMemberId);

		if (teamMember === null) {
			throw new Error('No team member found');
		}

		return teamMember;
	}

	static async createDepartment(departmentData: IDepartment): Promise<IDepartment> {
		if (!departmentData.name) {
			throw new Error('Department name is required');
		}

		const departmentExist = await db.Department.findOne({ where: { name: departmentData.name } });

		if (departmentExist) {
			throw new Error(`Department with the name ${departmentData.name} already exist`);
		}

		const department = await db.Department.create(departmentData);

		if (!department) {
			throw new Error(`Failed to create the following department ${departmentData.name}`);
		}

		return department;
	}

	static async getDepartments(): Promise<IDepartmentDirectory> {
		const departments = await db.Department.findAll({ order: [['name', 'ASC']] });

		const departmentCount: number = departments.length;

		return {
			departments: departments,
			count: departmentCount,
		};
	}
}
