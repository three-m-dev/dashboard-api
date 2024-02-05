import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAccount, IEmployee, IQueryParams } from '../interfaces';
import db from '../models';
import { EmployeeService } from './employee.service';

export class AccountService {
  private EmployeeService: EmployeeService;

  constructor() {
    this.EmployeeService = new EmployeeService();
  }

  public async createAccount(accountData: IAccount, employeeData?: IEmployee) {
    const txn = await db.sequelize.transaction();

    console.log('accountData', accountData);

    console.log('employeeData', employeeData);

    try {
      const existingAccount = await db.Account.findOne(
        { where: { username: accountData.username } },
        { transaction: txn }
      );

      if (existingAccount) {
        throw new Error('Username already exists');
      }

      if (!accountData.username || !accountData.password) {
        throw new Error('Username and password are required');
      }

      let account;
      let employee;

      const hashedPassword = await bcrypt.hash(accountData.password, 10);

      if (accountData.accountType === 'employee' || accountData.accountType === 'admin') {
        account = await db.Account.create(
          {
            username: accountData.username,
            password: hashedPassword,
            accountType: accountData.accountType,
            isActive: true,
          },
          { transaction: txn }
        );

        if (employeeData && this.EmployeeService) {
          employee = await this.EmployeeService.createEmployee(employeeData, account.id, txn);
        } else {
          throw new Error('Employee data is missing or EmployeeService is not accessible');
        }
      } else if (accountData.accountType === 'developer' || accountData.accountType === 'display') {
        account = await db.Account.create(
          {
            username: accountData.username,
            password: hashedPassword,
            accountType: accountData.accountType,
            isActive: true,
          },
          { transaction: txn }
        );
      } else {
        throw new Error('Invalid account type');
      }

      if (!account) {
        throw new Error('Account could not be created');
      }

      await txn.commit();

      if (employee) {
        return { account, employee };
      } else {
        return { account };
      }
    } catch (error) {
      await txn.rollback();

      throw error;
    }
  }

  public async getAccounts(params: IQueryParams) {
    const { filter, sort, page, pageSize, fields } = params;

    let whereClause = filter || {};
    let orderClause: [string, string][] = [];
    let limit = pageSize;
    let offset = page && pageSize ? (page - 1) * pageSize : 0;
    let attributes: string[] | undefined = fields;

    if (sort) {
      const [field, order] = sort.split(',');
      orderClause.push([field, order.toUpperCase()]);
    }

    const accounts = await db.Account.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.Account.count({
      where: whereClause,
    });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { accounts, total, pages };
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
