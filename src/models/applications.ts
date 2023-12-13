import { Model, DataTypes, Sequelize } from "sequelize";
import { IApplication, IRating } from "../shared/interfaces";

export class Application extends Model<IApplication> implements IApplication {
  public id!: string;
  public jobId?: string;
  public applicantId!: string;
  public phoneScreenDate?: Date;
  public interviewDate?: Date;
  public status!: Enumerator;
  public notes?: string;
  public ratings?: IRating[];
  public submittedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    Application.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        jobId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        applicantId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        phoneScreenDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        interviewDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["new", "reviewed", "offered", "accepted", "rejected", "withdrawn", "archived"],
          allowNull: false,
        },
        notes: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ratings: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: "applications",
        sequelize,
      }
    );
  }
}

export default Application;
