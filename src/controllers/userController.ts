import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/auth';
import { UserService } from '../services/userService';
import { IQueryParams } from '../shared/interfaces';

export class UserController {
	public async createDevOrAdminUser(req: Request, res: Response) {
		try {
			const userData = req.body;

			const userService = new UserService();

			const response = await userService.createDevOrAdminUser(userData);

			res.status(201).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getUsers(req: Request, res: Response) {
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

			const userService = new UserService();

			const response = await userService.getUsers(params);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
	public async getUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const userService = new UserService();

			const response = await userService.getUser(userId);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async updateUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const userService = new UserService();

			const response = await userService.updateUser(userId, req.body);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async deleteUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const userService = new UserService();

			const response = await userService.deleteUser(userId);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async login(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const userService = new UserService();

			const response = await userService.login(username, password);

			res.cookie('token', response.accessToken, {
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
				sameSite: 'none',
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

	public async logout(req: Request, res: Response) {
		try {
			res.cookie('token', '', {
				httpOnly: true,
				expires: new Date(0),
				secure: true,
				sameSite: 'none',
			});

			res.status(200).json({ message: 'Logout successful' });
		} catch (error) {
			res.status(500).json({ message: 'An unexpected error occurred during logout' });
		}
	}

	public async session(req: ExtendedRequest, res: Response) {
		if (req.user) {
			const user = { ...req.user.get({ plain: true }) };
			delete user.password;

			console.log('WTF');

			res.status(200).json({ authenticated: true, user });
		} else {
			res.status(401).json({ authenticated: false, message: 'Not authenticated' });
		}
	}
}
