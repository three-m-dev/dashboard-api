import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAccount } from '../shared/types';
import db from '../models';

export class AccountService {
	public async createAccount(accountData: IAccount) {
		const existingAccount = await db.Account.findOne({
			where: { username: accountData.username },
		});

		if (existingAccount) {
			throw new Error('Username already exists');
		}

		if (!accountData.username || !accountData.password) {
			throw new Error('Username and password are required');
		}

		let account;

		if (accountData.accountType === 'employee' || accountData.accountType === 'admin') {
			throw new Error('Account type not supported');

			// create employee within a txn with account
		} else if (accountData.accountType === 'developer' || accountData.accountType === 'display') {
			const hashedPassword = await bcrypt.hash(accountData.password, 10);

			account = await db.Account.create({
				username: accountData.username,
				password: hashedPassword,
				accountType: accountData.accountType,
				isActive: true,
			});
		} else {
			throw new Error('Invalid account type');
		}

		if (!account) {
			throw new Error('Account could not be created');
		}

		return account;
	}

	public async getAccounts() {
		const accounts = await db.Account.findAll();

		if (!accounts) {
			throw new Error('No accounts found');
		}

		return accounts;
	}

	public async getAccount(accountId: string) {
		const account = await db.Account.findByPk(accountId);

		if (!account) {
			throw new Error('Account not found');
		}

		return account;
	}

	public async updateAccount(accountId: string, accountData: IAccount) {}

	public async deleteAccount(accountId: string) {}

	public async login(username: string, password: string) {
		if (!username || !password) {
			throw new Error('Missing credentials');
		}

		console.log('password', username, password);

		const account = await db.Account.findOne({ where: { username: username } });

		if (!account) {
			throw new Error('Invalid username or password');
		}

		const passwordIsValid = await bcrypt.compare(password, account.password);

		if (!passwordIsValid) {
			throw new Error('Invalid username or password');
		}

		if (account.isActive === false) {
			throw new Error('Account is inactive');
		}

		const accessToken = sign({ accountId: account.id, username: account.username }, process.env.JWT_SECRET as string);

		await db.Account.update({ lastLogin: new Date() }, { where: { id: account.id } });

		if (account.accountType === 'employee') {
			const employee = await db.Employee.findOne({ where: { accountId: account.id } });

			return { accessToken, employee };
		} else {
			return { accessToken };
		}
	}
}
