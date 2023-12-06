import { Model, DataTypes, Sequelize } from "sequelize";
import { IResume } from "../shared/interfaces";

export class Resume extends Model<IResume> implements IResume {
  public id!: string;
  public status!: Enumerator;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public s3Ref!: string;
  public submittedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    Resume.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["new", "viewed", "favorite", "archived"],
          allowNull: false,
          defaultValue: "new",
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
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        s3Ref: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "resumes",
        sequelize,
      }
    );
  }
}

export default Resume;
