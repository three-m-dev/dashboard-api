import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models';
import { IQueryParams, IUser } from '../shared/interfaces';

export class UserService {
  public async getUsers(params: IQueryParams) {
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

    if (page && pageSize) {
      limit = pageSize;
      offset = (page - 1) * pageSize;
    }

    const users = await db.User.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const usersWithoutPasswords = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user.get({ plain: true });
      return userWithoutPassword;
    });

    const total = await db.User.count({ where: whereClause });
    const pages = limit ? Math.ceil(total / limit) : 0;

    return { users: usersWithoutPasswords, total, pages };
  }

  public async getUser(userId: string) {
    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user.get({ plain: true });

    return { user: userWithoutPassword };
  }

  public async updateUser(userId: string, updates: Partial<IUser>) {
    const restrictedFields = ['id', 'createdAt', 'accountType', 'password'];

    for (const field of restrictedFields) {
      if (updates[field as keyof IUser] !== undefined) {
        throw new Error(`Field '${field}' cannot be updated`);
      }
    }

    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates);

    await user.save();

    const { password, ...updatedUserWithoutPassword } = user.get({ plain: true });

    return { user: updatedUserWithoutPassword };
  }

  public async deleteUser(userId: string) {
    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();

    return user;
  }

  public async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error('Missing credentials');
    }

    const user = await db.User.findOne({ where: { username: username } });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new Error('Invalid username or password');
    }

    const accessToken = sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
      expiresIn: '12h',
    });

    return { accessToken };
  }
}
