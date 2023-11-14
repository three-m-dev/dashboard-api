import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validate } from 'uuid';
import { IUser, IUserDirectory, IUserParams, IUserWithoutPassword } from '../interfaces/ICommon';
import db from '../models';

export class UserService {
	static async createUser(createdById: string, data: IUser): Promise<IUserWithoutPassword> {
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
}
