import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/authMiddleware';
import { TeamService } from '../services/teamService';
import { EmailService } from '../services/emailService';
import { IUserParams } from '../interfaces/ICommon';

export class TeamController {
	public static async authUser(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const authResponse = await TeamService.authUser(username, password);

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

	public static async getUsers(req: Request, res: Response) {
		try {
			const queryParams: IUserParams = {};

			const allowedFilters = ['accountType', 'isActive'];

			allowedFilters.forEach((filter) => {
				if (req.query[filter]) {
					queryParams[filter as keyof IUserParams] = req.query[filter] as string;
				}
			});

			const users = await TeamService.getUsers(queryParams);

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

			const user = await TeamService.getUserById(userId);

			res.status(200).json(user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getEmployees(req: Request, res: Response) {
		try {
			const employees = await TeamService.getEmployees();

			res.status(200).json(employees);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getEmployeeById(req: Request, res: Response) {
		try {
			const employeeId: string = req.params.employeeId;

			const employee = await TeamService.getEmployeeById(employeeId);

			res.status(200).json(employee);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async createTeamMember(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const { user: userData, employee: employeeData } = req.body;

			const teamMember = await TeamService.createTeamMember(currentUser, userData, employeeData);

			res.status(201).json(teamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async sendWelcomeEmail(req: Request, res: Response) {
		try {
			const employeeId: string = req.params.employeeId;

			const employee = await TeamService.getEmployeeById(employeeId);

			const { email, firstName } = employee;

			await EmailService.sendWelcomeEmail(email, firstName);

			res.status(200).json({ message: 'Welcome email sent successfully!' });
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async sendPasswordResetEmail(req: Request, res: Response) {
		try {
			const employeeId: string = req.params.employeeId;

			const employee = await TeamService.getEmployeeById(employeeId);

			const { email, firstName } = employee;

			const resetLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

			await EmailService.sendPasswordResetEmail(email, firstName, resetLink);

			res.status(200).json({ message: 'Password reset email sent successfully!' });
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
