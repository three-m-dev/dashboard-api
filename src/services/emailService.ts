export class EmailService {
	static async sendEmail(email: string, subject: string, body: string): Promise<void> {}

	static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
		const subject = 'Password Reset';
		const body = `Click the link below to reset your password: ${resetToken}`;
		await EmailService.sendEmail(email, subject, body);
	}

	static async sendUnsubscribeEmail(email: string, unsubscribeToken: string): Promise<void> {
		const subject = 'Unsubscribe';
		const body = `Click the link below to unsubscribe: ${unsubscribeToken}`;
		await EmailService.sendEmail(email, subject, body);
	}
}
