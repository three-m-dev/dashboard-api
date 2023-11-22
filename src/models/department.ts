import { Model, DataTypes, Sequelize } from "sequelize";
import { IDepartment } from "../interfaces/ICommon";

export class Department extends Model<IDepartment> implements IDepartment {
  public id!: string;
  public name!: string;
  public teamMemberCount!: number;

  public static initialize(sequelize: Sequelize) {
    Department.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        teamMemberCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: "departments",
        sequelize,
      }
    );
  }
}

export default Department;
