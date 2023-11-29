import { Model, DataTypes, Sequelize } from "sequelize";
import { IAddress, ITeamMember } from "../interfaces/ICommon";

export class TeamMember extends Model<ITeamMember> implements ITeamMember {
  public id!: string;
  public userId!: string;
  public firstName!: string;
  public middleInitial?: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber?: string;
  public address!: IAddress;
  public dateOfBirth?: Date;
  public company!: Enumerator;
  public department!: string;
  public role!: string;
  public directReport!: string;
  public type!: Enumerator;
  public status!: Enumerator;
  public salary?: number;
  public notes?: string;
  public createdBy!: string;
  public updatedBy!: string;
  public hiredAt!: Date;
  public terminatedAt?: Date;
  public resignedAt?: Date;

  public static initialize(sequelize: Sequelize) {
    TeamMember.init(
      {
        id: {
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
        company: {
          type: DataTypes.ENUM,
          values: ["three-m", "ultra-grip"],
          allowNull: false,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        directReport: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM,
          values: ["full-time", "part-time", "contract", "internship"],
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["active", "inactive", "terminated", "resigned"],
          defaultValue: "active",
          allowNull: false,
        },
        salary: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        hiredAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        terminatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        resignedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "teamMembers",
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

export default TeamMember;
