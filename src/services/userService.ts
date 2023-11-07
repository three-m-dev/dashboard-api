import User, { IUser } from "../models/user";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface UserInfo {
  username: string;
  accountType: string;
  isActive: boolean;
  createdBy: string;
}

export interface UserParams {
  accountType?: string;
  isActive?: string;
}

export class UserService {
  static async createUser(userData: IUser): Promise<{ username: string; accountType: string }> {
    const requiredFields = ["username", "password", "accountType"] as const;

    const missingField = requiredFields.find((field) => !userData[field]);
    if (missingField) {
      throw new Error(`Missing required field: ${missingField}`);
    }

    const existingUser = await User.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const newUser = await User.create(userData);

    return {
      username: newUser.username,
      accountType: newUser.accountType,
    };
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

    const accessToken = sign(
      { id: user.userId, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

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
      attributes: ["username", "accountType", "isActive", "createdBy"],
      where: whereConditions,
    });

    if (users.length === 0) {
      throw new Error("No users found");
    }

    const userInfo = users.map((user) => ({
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
      createdBy: user.createdBy,
    }));

    return userInfo;
  }
}
