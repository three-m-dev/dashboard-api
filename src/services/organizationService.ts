import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validate } from "uuid";
import { IDepartment, ITeamMember, IUser, IQueryParams } from "../shared/interfaces";
import db from "../models";
import { formatEmail, formatPhoneNumber, formatUUID } from "../utils/formatter";

export class OrganizationService {
  // Authentication
  static async authUser(username: string, password: string) {
    if (!username || !password) {
      throw new Error("Missing credentials");
    }

    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new Error("Invalid password");
    }

    const accessToken = sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
      expiresIn: "3h",
    });

    return { accessToken };
  }

  // Users
  static async getUsers(params: IQueryParams) {
    const { filter, sort, page, pageSize, fields } = params;

    let whereClause = filter || {};
    let orderClause: [string, string][] = [];
    let limit = pageSize;
    let offset = page && pageSize ? (page - 1) * pageSize : 0;
    let attributes: string[] | undefined = fields;

    if (sort) {
      const [field, order] = sort.split(",");
      orderClause.push([field, order.toUpperCase()]);
    }

    const users = await db.User.findAll({
      where: whereClause,
      order: orderClause.length > 0 ? orderClause : undefined,
      limit,
      offset,
      attributes,
    });

    const userCount = users.length;

    if (userCount === 0) {
      throw new Error("No users found");
    }

    return {
      users: users,
      count: userCount,
    };
  }

  static async getUser(userId: string) {
    if (userId === null || userId === undefined) {
      throw new Error("User ID is required and cannot be null or undefined.");
    }

    if (!validate(userId)) {
      throw new Error("User ID format is invalid. Please provide a correctly formatted ID.");
    }

    const user = await db.User.findByPk(userId);

    if (user === null) {
      throw new Error("User not found for the provided ID.");
    }

    const { password, ...userWithoutPassword } = user.get({ plain: true });

    return userWithoutPassword;
  }

  static async updateUser(userId: string) {}

  static async deleteUser(userId: string) {
    if (userId === null || userId === undefined) {
      throw new Error("User ID is required and cannot be null or undefined.");
    }

    if (!validate(userId)) {
      throw new Error("User ID format is invalid. Please provide a correctly formatted ID.");
    }

    const user = await db.User.findByPk(userId);

    if (user === null) {
      throw new Error("User not found for the provided ID.");
    }

    await user.destroy();
  }

  // Team Members
  static async createTeamMember(createdById: string, userData: IUser, teamMemberData: ITeamMember) {
    const t = await db.sequelize.transaction();

    try {
      const { username, password } = userData;

      if (!username || !password) {
        throw new Error("Missing required fields");
      }

      const existingUser = await db.User.findOne(
        {
          where: { username: username },
        },
        { transaction: t }
      );

      if (existingUser) {
        throw new Error(`User with the username ${username} already exists`);
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password.length > 20) {
        throw new Error("Password cannot be more than 20 characters long");
      }

      if (password.search(/[a-z]/i) < 0) {
        throw new Error("Password must contain at least one letter");
      }

      if (password.search(/[0-9]/) < 0) {
        throw new Error("Password must contain at least one number");
      }

      if (password.search(/[!@#$%^&*]/) < 0) {
        throw new Error("Password must contain at least one special character");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.User.create(
        {
          ...userData,
          password: hashedPassword,
          createdBy: createdById,
          updatedBy: createdById,
        },
        { transaction: t }
      );

      const { password: userPassword, ...userWithoutPassword } = user.get({ plain: true });

      const existingTeamMember = await db.TeamMember.findAll(
        {
          where: { userId: user.id },
        },
        { transaction: t }
      );

      if (existingTeamMember.length > 0) {
        throw new Error("User already associated with an team member");
      }

      const { firstName, lastName, email, phoneNumber, company, department, role, directReport, type, hiredAt } =
        teamMemberData;

      if (!firstName || !lastName || !email || !company || !department || !role || !directReport || !type || !hiredAt) {
        throw new Error("Missing required fields");
      }

      let formattedPhoneNumber: string | undefined;

      if (phoneNumber) {
        formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      }

      const teamMember = await db.TeamMember.create(
        {
          ...teamMemberData,
          userId: user.id,
          email: formatEmail(email),
          phoneNumber: formattedPhoneNumber,
          directReport: formatUUID(directReport),
          createdBy: formatUUID(createdById),
          updatedBy: formatUUID(createdById),
        },
        { transaction: t }
      );

      await t.commit();
      return { user: userWithoutPassword, teamMember };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getTeamMembers(params: IQueryParams) {
    const { filter, sort, page, pageSize, fields } = params;

    let whereClause = filter || {};
    let orderClause: [string, string][] = [];
    let limit = pageSize;
    let offset = page && pageSize ? (page - 1) * pageSize : 0;
    let attributes: string[] | undefined = fields;

    if (sort) {
      const [field, order] = sort.split(",");
      orderClause.push([field, order.toUpperCase()]);
    }

    const teamMembers = await db.TeamMember.findAll({
      where: whereClause,
      order: orderClause.length > 0 ? orderClause : undefined,
      limit,
      offset,
      attributes,
    });

    const teamMemberCount = teamMembers.length;

    if (teamMemberCount === 0) {
      throw new Error("No team members found");
    }

    return {
      teamMembers: teamMembers,
      count: teamMemberCount,
    };
  }

  static async getTeamMember(teamMemberId: string) {
    if (teamMemberId === null || teamMemberId === undefined) {
      throw new Error("Team Member ID is required and cannot be null or undefined.");
    }

    if (!validate(teamMemberId)) {
      throw new Error("Team Member ID format is invalid. Please provide a correctly formatted ID.");
    }

    const teamMember = await db.TeamMember.findByPk(teamMemberId);

    if (teamMember === null) {
      throw new Error("Team Member not found for the provided ID.");
    }

    return teamMember;
  }

  static async getTeamMemberByUserId(userId: string) {
    if (userId === null || userId === undefined) {
      throw new Error("User ID is required and cannot be null or undefined.");
    }

    if (!validate(userId)) {
      throw new Error("User ID format is invalid. Please provide a correctly formatted ID.");
    }

    const teamMember = await db.TeamMember.findOne({ where: { userId: userId } });

    if (teamMember === null) {
      throw new Error("Team Member not found for the provided ID.");
    }

    return teamMember;
  }

  static async updateTeamMember(teamMemberId: string) {}

  static async deleteTeamMember(teamMemberId: string) {
    if (teamMemberId === null || teamMemberId === undefined) {
      throw new Error("Team Member ID is required and cannot be null or undefined.");
    }

    if (!validate(teamMemberId)) {
      throw new Error("Team Member ID format is invalid. Please provide a correctly formatted ID.");
    }

    const teamMember = await db.TeamMember.findByPk(teamMemberId);

    if (teamMember === null) {
      throw new Error("Team Member not found for the provided ID.");
    }

    await teamMember.destroy();
  }

  // Departments
  static async createDepartment(departmentData: IDepartment) {
    if (!departmentData.name) {
      throw new Error("Department name is required");
    }

    const departmentExist = await db.Department.findOne({ where: { name: departmentData.name } });

    if (departmentExist) {
      throw new Error(`Department with the name ${departmentData.name} already exist`);
    }

    const department = await db.Department.create(departmentData);

    if (!department) {
      throw new Error(`Failed to create the following department ${departmentData.name}`);
    }

    return department;
  }

  static async getDepartments() {
    const departments = await db.Department.findAll({ order: [["name", "ASC"]] });

    const departmentCount: number = departments.length;

    return {
      departments: departments,
      count: departmentCount,
    };
  }

  static async getDepartment(departmentId: string) {
    if (departmentId === null || departmentId === undefined) {
      throw new Error("Department ID is required and cannot be null or undefined.");
    }

    if (!validate(departmentId)) {
      throw new Error("Department ID format is invalid. Please provide a correctly formatted ID.");
    }

    const department = await db.Department.findByPk(departmentId);

    if (department === null) {
      throw new Error("Department not found for the provided ID.");
    }

    return department;
  }

  static async updateDepartment(departmentId: string) {}

  static async deleteDepartment(departmentId: string) {
    if (departmentId === null || departmentId === undefined) {
      throw new Error("Department ID is required and cannot be null or undefined.");
    }

    if (!validate(departmentId)) {
      throw new Error("Department ID format is invalid. Please provide a correctly formatted ID.");
    }

    const department = await db.Department.findByPk(departmentId);

    if (department === null) {
      throw new Error("Department not found for the provided ID.");
    }

    await department.destroy();
  }
}
