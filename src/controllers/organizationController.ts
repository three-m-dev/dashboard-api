import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/authMiddleware';
import { OrganizationService } from '../services/organizationService';
import { EmailService } from '../services/emailService';
import { IQueryParams } from '../shared/interfaces';

export class OrganizationController {
	// Authentication
	public static async login(req: Request, res: Response) {
		try {
			const { username, password } = req.body;

			const authResponse = await OrganizationService.login(username, password);

			res.cookie('token', authResponse.accessToken, {
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

	public static async logout(req: Request, res: Response) {
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

	public static async session(req: ExtendedRequest, res: Response) {
		if (req.user) {
			const userWithoutPassword = { ...req.user.get({ plain: true }) };
			delete userWithoutPassword.password;

			res.status(200).json({ loggedIn: true, user: userWithoutPassword });
		} else {
			res.status(401).json({ loggedIn: false, message: 'Not authenticated' });
		}
	}

	// Users
	public static async getUsers(req: Request, res: Response) {
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

			const users = await OrganizationService.getUsers(params);

			res.status(200).json(users);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const user = await OrganizationService.getUser(userId);

			res.status(200).json(user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async updateUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const user = await OrganizationService.updateUser(userId);

			res.status(200).json(user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async deleteUser(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const user = await OrganizationService.deleteUser(userId);

			res.status(200).json(user);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	// Team Members
	public static async createTeamMember(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const { user: userData, teamMember: teamMemberData } = req.body;

			const userAndTeamMember = await OrganizationService.createTeamMember(currentUser, userData, teamMemberData);

			res.status(201).json(userAndTeamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getTeamMembers(req: Request, res: Response) {
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
			const teamMembers = await OrganizationService.getTeamMembers(params);

			res.status(200).json(teamMembers);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getTeamMember(req: Request, res: Response) {
		try {
			const teamMemberId: string = req.params.teamMemberId;

			const teamMember = await OrganizationService.getTeamMember(teamMemberId);

			res.status(200).json(teamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getTeamMemberByUserId(req: Request, res: Response) {
		try {
			const userId: string = req.params.userId;

			const teamMember = await OrganizationService.getTeamMemberByUserId(userId);

			res.status(200).json(teamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async updateTeamMember(req: Request, res: Response) {
		try {
			const teamMemberId: string = req.params.teamMemberId;

			const teamMember = await OrganizationService.updateTeamMember(teamMemberId);

			res.status(200).json(teamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async deleteTeamMember(req: Request, res: Response) {
		try {
			const teamMemberId: string = req.params.teamMemberId;

			const teamMember = await OrganizationService.deleteTeamMember(teamMemberId);

			res.status(200).json(teamMember);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	// Departments
	public static async createDepartment(req: Request, res: Response) {
		try {
			const departmentData = req.body;

			const department = await OrganizationService.createDepartment(departmentData);

			res.status(201).json(department);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getDepartments(req: Request, res: Response) {
		try {
			const departments = await OrganizationService.getDepartments();

			res.status(200).json(departments);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public static async getDepartment(req: Request, res: Response) {}

	public static async updateDepartment(req: Request, res: Response) {}

	public static async deleteDepartment(req: Request, res: Response) {}

	// Email
	public static async sendWelcomeEmail(req: Request, res: Response) {
		try {
			const teamMemberId: string = req.params.teamMemberId;

			const teamMember = await OrganizationService.getTeamMember(teamMemberId);

			const { email, firstName } = teamMember;

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
			const teamMemberId: string = req.params.teamMemberId;

			const teamMember = await OrganizationService.getTeamMember(teamMemberId);

			const { email, firstName } = teamMember;

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
