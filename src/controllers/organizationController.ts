import { Request, Response } from "express";
import { ExtendedRequest } from "../middleware/authMiddleware";
import { OrganizationService } from "../services/organizationService";
import { EmailService } from "../services/emailService";
import { IUserParams } from "../interfaces/ICommon";

export class OrganizationController {
  public static async authUser(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const authResponse = await OrganizationService.authUser(username, password);

      res.cookie("jwt", authResponse.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      });

      res.status(200).json({ message: "Authentication successful" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async logoutUser(req: Request, res: Response) {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred during logout" });
    }
  }

  public static async validateSession(req: ExtendedRequest, res: Response) {
    if (req.user) {
      const userWithoutPassword = { ...req.user.get({ plain: true }) };
      delete userWithoutPassword.password;

      res.status(200).json({ isAuthenticated: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ isAuthenticated: false, message: "Not authenticated" });
    }
  }

  public static async getUsers(req: Request, res: Response) {
    try {
      const queryParams: IUserParams = {};

      const allowedFilters = ["accountType", "isActive"];

      allowedFilters.forEach((filter) => {
        if (req.query[filter]) {
          queryParams[filter as keyof IUserParams] = req.query[filter] as string;
        }
      });

      const users = await OrganizationService.getUsers(queryParams);

      res.status(200).json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getUserById(req: Request, res: Response) {
    try {
      const userId: string = req.params.userId;

      const user = await OrganizationService.getUserById(userId);

      res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getTeamMembers(req: Request, res: Response) {
    try {
      const teamMembers = await OrganizationService.getTeamMembers();

      res.status(200).json(teamMembers);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getTeamMemberById(req: Request, res: Response) {
    try {
      const teamMemberId: string = req.params.teamMemberId;

      const teamMember = await OrganizationService.getTeamMemberById(teamMemberId);

      res.status(200).json(teamMember);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async createUserAndTeamMember(req: ExtendedRequest, res: Response) {
    try {
      const currentUser = req.user.id;

      const { user: userData, teamMember: teamMemberData } = req.body;

      const userAndTeamMember = await OrganizationService.createUserAndTeamMember(
        currentUser,
        userData,
        teamMemberData
      );

      res.status(201).json(userAndTeamMember);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async createDepartment(req: Request, res: Response) {
    try {
      const departmentData = req.body;

      const department = await OrganizationService.createDepartment(departmentData);

      res.status(201).json(department);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getDepartments(req: Request, res: Response) {
    try {
      const departments = await OrganizationService.getDepartments();

      res.status(200).json(departments);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async sendWelcomeEmail(req: Request, res: Response) {
    try {
      const teamMemberId: string = req.params.teamMemberId;

      const teamMember = await OrganizationService.getTeamMemberById(teamMemberId);

      const { email, firstName } = teamMember;

      await EmailService.sendWelcomeEmail(email, firstName);

      res.status(200).json({ message: "Welcome email sent successfully!" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async sendPasswordResetEmail(req: Request, res: Response) {
    try {
      const teamMemberId: string = req.params.teamMemberId;

      const teamMember = await OrganizationService.getTeamMemberById(teamMemberId);

      const { email, firstName } = teamMember;

      const resetLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

      await EmailService.sendPasswordResetEmail(email, firstName, resetLink);

      res.status(200).json({ message: "Password reset email sent successfully!" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
