import { Model, DataTypes, Sequelize } from "sequelize";
import { IApplicant, IApplication } from "../shared/interfaces";

export class Application extends Model<IApplication> implements IApplication {
  public id!: string;
  public careerId!: string;
  public status!: Enumerator;
  public source!: Enumerator;
  public applicant!: IApplicant;
  public submittedAt!: Date;
  public processedAt?: Date;

  public static initialize(sequelize: Sequelize) {
    Application.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        careerId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["new", "reviewed", "contacted", "interviewed", "offered", "hired", "rejected"],
          defaultValue: "new",
          allowNull: false,
        },
        source: {
          type: DataTypes.ENUM,
          values: ["website", "indeed", "craigslist"],
          defaultValue: "website",
          allowNull: false,
        },
        applicant: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        submittedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        processedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "applications",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.Career, {
      foreignKey: "careerId",
      as: "career",
    });
  }
}

export default Application;
