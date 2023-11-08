import User from "../models/user";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/ICommon";

interface UserInfo {
  username: string;
  accountType: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface UserParams {
  userId?: string;
  accountType?: string;
  isActive?: string;
}

export class UserService {
  static async createUser(createdById: string, userData: IUser): Promise<UserInfo> {
    const requiredFields = ["username", "password", "accountType"] as const;

    const missingField = requiredFields.find((field) => !userData[field]);

    if (missingField) {
      throw new Error(`Missing required field: ${missingField}`);
    }

    const existingUser = await User.findAll({
      where: { username: userData.username },
    });

    if (existingUser.length > 0) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      createdBy: createdById,
      updatedBy: createdById,
    });

    const userInfo: UserInfo = {
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    };

    return userInfo;
  }

  static async authUser(username: string, password: string): Promise<{ accessToken: string }> {
    if (!username || !password) {
      throw new Error("Missing credentials");
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new Error("Invalid password");
    }

    const accessToken = sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return { accessToken };
  }

  static async getUsers(params: UserParams): Promise<UserInfo[]> {
    const { accountType, isActive } = params;

    const isActiveBoolean = isActive ? isActive === "true" : undefined;

    let whereConditions: any = {};

    if (accountType) {
      whereConditions.accountType = accountType;
    }

    if (isActiveBoolean !== undefined) {
      whereConditions.isActive = isActiveBoolean;
    }

    const users = await User.findAll({
      where: whereConditions,
      order: [["username", "ASC"]],
    });

    if (users.length === 0) {
      throw new Error("No users found");
    }

    const userInfo = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    }));

    return userInfo;
  }

  static async getUserById(userId: string): Promise<UserInfo> {
    if (userId === null) {
      throw new Error("Invalid search criteria");
    }

    const user = await User.findOne({
      where: { userId: userId },
    });

    if (user === null) {
      throw new Error("No user found");
    }

    const userInfo = {
      userId: user.userId,
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    };

    return userInfo;
  }
}
