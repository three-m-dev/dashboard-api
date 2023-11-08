import { IEmployee, IEmployeeDetail } from "../interfaces/ICommon";
import Employee from "../models/employee";

export class EmployeeService {
  static async createEmployee(userId: string, employeeData: IEmployee): Promise<IEmployee> {
    const existingEmployee = await Employee.findAll({
      where: { userId: userId },
    });

    if (existingEmployee.length > 0) {
      throw new Error("User already associated with employee");
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "hireDate",
      "role",
      "department",
      "directReport",
      "employmentStatus",
    ] as const;

    const missingField = requiredFields.find((field) => !employeeData[field]);

    if (missingField) {
      throw new Error(`Missing required field: ${missingField}`);
    }

    const employee: IEmployee = await Employee.create({
      employeeId: employeeData.employeeId,
      userId: userId,
      firstName: employeeData.firstName,
      middleInitial: employeeData.middleInitial,
      lastName: employeeData.lastName,
      email: employeeData.email,
      phoneNumber: employeeData.phoneNumber,
      address: employeeData.address,
      dateOfBirth: employeeData.dateOfBirth,
      hireDate: employeeData.hireDate,
      role: employeeData.role,
      department: employeeData.department,
      directReport: employeeData.directReport,
      employmentStatus: employeeData.employmentStatus,
      salary: employeeData.salary,
      endDate: employeeData.endDate,
      notes: employeeData.notes,
    });

    return employee;
  }

  static async getEmployees(): Promise<IEmployeeDetail> {
    const employees = await Employee.findAll({
      order: [["lastName", "ASC"]],
    });

    const employeeCount: number = employees.length;

    if (employeeCount === 0) {
      throw new Error("No employees found");
    }

    const employeeInfo = employees.map((employee) => ({
      employeeId: employee.employeeId,
      userId: employee.userId,
      firstName: employee.firstName,
      middleInitial: employee.middleInitial,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      dateOfBirth: employee.dateOfBirth,
      hireDate: employee.hireDate,
      role: employee.role,
      department: employee.department,
      directReport: employee.directReport,
      employmentStatus: employee.employmentStatus,
      salary: employee.salary,
      endDate: employee.endDate,
      notes: employee.notes,
    }));

    return {
      employeeCount,
      employeeInfo,
    };
  }
}
