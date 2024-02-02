import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/auth';
import { AccountService } from '../services/accountService';
import { IQueryParams } from '../interfaces';

export class AccountController {
	public async createAccount(req: Request, res: Response) {
		try {
			const { account: accountData, employee: employeeData } = req.body;

			const accountService = new AccountService();

			const response = await accountService.createAccount(accountData, employeeData);

			res.status(201).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getAccounts(req: Request, res: Response) {
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

			const accountService = new AccountService();

			const response = await accountService.getAccounts(params);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getAccount(req: Request, res: Response) {
		try {
			const accountId: string = req.params.accountId;

			const accountService = new AccountService();

			const response = await accountService.getAccount(accountId);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async updateAccount(req: Request, res: Response) {}

	public async deleteAccount(req: Request, res: Response) {}

	public async login(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const accountService = new AccountService();

			const response = await accountService.login(username, password);

			res.cookie('token', response.accessToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
			});

			res.status(200).json({ message: 'Authentication successful', employee: response.employee });
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
		if (req.account) {
			const account = { ...req.account.get({ plain: true }) };
			delete account.password;
			delete account.resetToken;
			delete account.resetTokenExpires;
			delete account.lastLogin;
			delete account.isActive;
			delete account.createdAt;
			delete account.updatedAt;

			res.status(200).json({ authenticated: true, account });
		} else {
			res.status(401).json({ authenticated: false, message: 'Not authenticated' });
		}
	}
}
