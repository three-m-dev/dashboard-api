import { IEmployee, IEmployeeDirectory, IEmployeeInfo } from "../interfaces/ICommon";
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

  static async getEmployees(): Promise<IEmployeeDirectory> {
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
      hireDate: employee.hireDate,
      role: employee.role,
      department: employee.department,
      directReport: employee.directReport,
      employmentStatus: employee.employmentStatus,
    }));

    return {
      employees: employeeInfo,
      count: employeeCount,
    };
  }

  static async getEmployeeById(employeeId: string): Promise<IEmployeeInfo> {
    if (employeeId === null) {
      throw new Error("Invalid search criteria");
    }

    const employee = await Employee.findByPk(employeeId);

    if (employee === null) {
      throw new Error("No employee found");
    }

    const employeeInfo = {
      employeeId: employee.employeeId,
      userId: employee.userId,
      firstName: employee.firstName,
      middleInitial: employee.middleInitial,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      hireDate: employee.hireDate,
      role: employee.role,
      department: employee.department,
      directReport: employee.directReport,
      employmentStatus: employee.employmentStatus,
    };

    return employeeInfo;
  }
}
