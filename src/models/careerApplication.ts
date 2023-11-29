import { Model, DataTypes, Sequelize } from "sequelize";
import { IApplicant, ICareerApplication } from "../interfaces/ICommon";

export class CareerApplication extends Model<ICareerApplication> implements ICareerApplication {
  public id!: string;
  public careerListingId!: string;
  public status!: Enumerator;
  public source!: Enumerator;
  public applicant!: IApplicant;
  public submittedAt!: Date;
  public processedAt?: Date;

  public static initialize(sequelize: Sequelize) {
    CareerApplication.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        careerListingId: {
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
        tableName: "careerApplications",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.CareerListing, {
      foreignKey: "careerListingId",
      as: "careerListing",
    });
  }
}

export default CareerApplication;
