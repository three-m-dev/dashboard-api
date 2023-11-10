import nodemailer from 'nodemailer';
import nodemailerHbs from 'nodemailer-express-handlebars';
import path from 'path';

export class EmailService {
	static transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: 587,
		secure: false,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	static initializeTemplates() {
		EmailService.transporter.use(
			'compile',
			nodemailerHbs({
				viewEngine: {
					extname: '.handlebars',
					partialsDir: path.resolve('./views/'),
					defaultLayout: false,
				},
				viewPath: path.resolve('./views/'),
			})
		);
	}

	static async sendEmail(email: string, subject: string, template: string, context: any): Promise<void> {
		const mailOptions = {
			from: `Three M <${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: subject,
			template: template,
			context: context,
		};

		const result = await EmailService.transporter.sendMail(mailOptions);
		if (!result) {
			throw new Error('Failed to send email');
		}
	}

	static async sendWelcomeEmail(toEmail: string, firstName: string): Promise<void> {
		const subject = 'Getting Started at Three M';
		const template = 'welcome';
		const context = {
			name: firstName,
			nextTraining: '12/12/2023',
		};

		await EmailService.sendEmail(toEmail, subject, template, context);
	}

	static async sendPasswordResetEmail(toEmail: string, firstName: string, resetLink: string): Promise<void> {
		const subject = 'Password Reset';
		const template = 'passwordReset';
		const context = {
			name: firstName,
			resetLink: resetLink,
		};

		await EmailService.sendEmail(toEmail, subject, template, context);
	}
}
