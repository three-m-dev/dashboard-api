import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import { IUserParams } from '../interfaces/ICommon';

export class UserController {
	public static async authUser(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const authResponse = await UserService.authUser(username, password);

			res.cookie('jwt', authResponse.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 24 * 60 * 60 * 1000,
				sameSite: 'strict',
			});

			res.status(200).json({ message: 'Authentication successful' });
		} catch (error) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async logoutUser(req: Request, res: Response) {
		try {
			res.cookie('jwt', '', {
				httpOnly: true,
				expires: new Date(0),
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
			});

			res.status(200).json({ message: 'Logout successful' });
		} catch (error) {
			res.status(500).json({ message: 'An unexpected error occurred during logout' });
		}
	}

	public static async validateSession(req: ExtendedRequest, res: Response) {
		if (req.user) {
			const userWithoutPassword = { ...req.user.get({ plain: true }) };
			delete userWithoutPassword.password;

			res.status(200).json({ isAuthenticated: true, user: userWithoutPassword });
		} else {
			res.status(401).json({ isAuthenticated: false, message: 'Not authenticated' });
		}
	}

	public static async createUser(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const newUser = await UserService.createUser(currentUser, req.body);

			res.status(201).json(newUser);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getUsers(req: Request, res: Response) {
		try {
			const queryParams: IUserParams = {};

			const allowedFilters = ['accountType', 'isActive'];

			allowedFilters.forEach((filter) => {
				if (req.query[filter]) {
					queryParams[filter as keyof IUserParams] = req.query[filter] as string;
				}
			});

			const users = await UserService.getUsers(queryParams);

			res.status(200).json(users);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getUserById(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const user = await UserService.getUserById(userId);

			res.status(200).json(user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
