import { Model, DataTypes, Sequelize } from "sequelize";

export interface IUser {
  userId: string;
  username: string;
  password: string;
  accountType: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export class User extends Model<IUser> implements IUser {
  public userId!: string;
  public username!: string;
  public password!: string;
  public accountType!: string;
  public isActive!: boolean;
  public createdBy!: string;
  public updatedBy!: string;

  public static initialize(sequelize: Sequelize) {
    User.init(
      {
        userId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        accountType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        tableName: "users",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.hasOne(models.Employee, {
      foreignKey: "userId",
      as: "employee",
    });
  }
}

export default User;
