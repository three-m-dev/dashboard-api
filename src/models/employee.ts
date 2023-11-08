import { Model, DataTypes, Sequelize } from "sequelize";
import { IAddress, IEmployee } from "../interfaces/ICommon";

export class Employee extends Model<IEmployee> implements IEmployee {
  public employeeId!: string;
  public userId!: string;
  public firstName!: string;
  public middleInitial?: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber?: string;
  public address!: IAddress;
  public dateOfBirth?: Date;
  public hireDate!: Date;
  public role!: string;
  public department!: string;
  public directReport!: string;
  public employmentStatus!: string;
  public salary?: number;
  public endDate?: Date;
  public notes?: string;

  public static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        employeeId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        middleInitial: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        address: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        hireDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        directReport: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        employmentStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        salary: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: "employees",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

export default Employee;
