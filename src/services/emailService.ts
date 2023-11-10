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
			from: `Setup <${process.env.EMAIL_USERNAME}>`,
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

	static async sendWelcomeEmail(toEmail: string, userName: string): Promise<void> {
		const subject = 'Welcome to Three M!';
		const template = 'welcome';
		const context = {
			name: userName,
			support_email: 'support@setup123.com',
			foundation_year: 1971,
			number_of_countries: 50,
		};

		await EmailService.sendEmail(toEmail, subject, template, context);
	}
}
