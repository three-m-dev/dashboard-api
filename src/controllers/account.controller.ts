import { Request, Response } from 'express';
import { ExtendedRequest } from '../middleware/auth';
import { AccountService } from '../services/account.service';
import { IQueryParams } from '../interfaces';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  public createAccount = async (req: Request, res: Response) => {
    try {
      const { account: accountData, employee: employeeData } = req.body;

      const response = await this.accountService.createAccount(accountData, employeeData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getAccounts = async (req: Request, res: Response) => {
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

      const response = await this.accountService.getAccounts(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public getAccount = async (req: Request, res: Response) => {
    try {
      const accountId: string = req.params.accountId;

      const response = await this.accountService.getAccount(accountId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  public updateAccount = async (req: Request, res: Response) => {};

  public deleteAccount = async (req: Request, res: Response) => {};

  public login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const response = await this.accountService.login(username, password);

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
  };

  public logout = async (req: Request, res: Response) => {
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
  };

  public session = async (req: ExtendedRequest, res: Response) => {
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
  };
}
