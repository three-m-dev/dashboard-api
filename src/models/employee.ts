import { Model, DataTypes, Sequelize } from "sequelize";

export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  password: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  startDate: Date;
  salary: number;
  reportsTo: string;
  isActive: boolean;
  notes: string;
}

export class Employee extends Model<IEmployee> implements IEmployee {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public dateOfBirth!: Date;
  public password!: string;
  public jobTitle!: string;
  public department!: string;
  public employmentType!: string;
  public startDate!: Date;
  public salary!: number;
  public reportsTo!: string;
  public isActive!: boolean;
  public notes!: string;

  public static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        employmentType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        salary: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        reportsTo: {
          type: DataTypes.UUID,
          allowNull: true, // Making this true as not everyone will have a person to report to
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true, // Making this true as notes are not mandatory
        },
      },
      {
        tableName: "employees",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    // Self-referential association
    this.belongsTo(models.Employee, {
      as: "ReportTo",
      foreignKey: "reportsTo",
    });
    this.hasMany(models.Employee, {
      as: "TeamMembers",
      foreignKey: "reportsTo",
    });
  }
}

export default Employee;
