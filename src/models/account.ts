import { Model, DataTypes, Sequelize } from 'sequelize';
import { IAccount } from '../interfaces';

class Account extends Model<IAccount> implements IAccount {
  public id!: string;
  public username!: string;
  public password!: string;
  public accountType!: string;
  public resetToken?: string;
  public resetTokenExpires?: Date;
  public lastLogin?: Date;
  public isActive!: boolean;

  public static initialize(sequelize: Sequelize) {
    Account.init(
      {
        id: {
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
          defaultValue: 'employee',
          allowNull: false,
        },
        resetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        tableName: 'accounts',
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    Account.hasOne(models.Employee, {
      sourceKey: 'id',
      foreignKey: 'accountId',
      as: 'employee',
      onDelete: 'CASCADE',
    });
  }
}

export default Account;
