import { Request, Response } from "express";
import { ExtendedRequest } from "../middleware/authMiddleware";
import { EmployeeService } from "../services/employeeService";

export class EmployeeController {
  public static async createEmployee(req: ExtendedRequest, res: Response) {
    try {
      const userId: string = req.params.userId;

      const newUser = await EmployeeService.createEmployee(userId, req.body);

      res.status(201).json(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getEmployees(req: Request, res: Response) {
    try {
      const employees = await EmployeeService.getEmployees();

      res.status(200).json(employees);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
