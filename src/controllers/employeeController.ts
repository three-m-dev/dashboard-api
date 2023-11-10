import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/authMiddleware';
import { EmployeeService } from '../services/employeeService';
import { EmailService } from '../services/emailService';

export class EmployeeController {
	public static async createEmployee(req: ExtendedRequest, res: Response) {
		try {
			const currentUser = req.user.id;

			const userId = req.params.userId;

			const newEmployee = await EmployeeService.createEmployee(currentUser, userId, req.body);

			res.status(201).json(newEmployee);
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
			const employees = await EmployeeService.getEmployees();

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

			const employee = await EmployeeService.getEmployeeById(employeeId);

			res.status(200).json(employee);
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

			const employee = await EmployeeService.getEmployeeById(employeeId);

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

			const employee = await EmployeeService.getEmployeeById(employeeId);

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
