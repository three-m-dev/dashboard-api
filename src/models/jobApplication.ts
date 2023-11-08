import { Model, DataTypes, Sequelize } from "sequelize";
import { IApplicant, IJobApplication } from "../interfaces/ICommon";

export class JobApplication extends Model<IJobApplication> implements IJobApplication {
  public jobApplicationId!: string;
  public jobListingId!: string;
  public applicationDate!: Date;
  public applicationStatus!: Enumerator;
  public applicationSource!: Enumerator;
  public applicant!: IApplicant;

  public static initialize(sequelize: Sequelize) {
    JobApplication.init(
      {
        jobApplicationId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        jobListingId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        applicationDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        applicationStatus: {
          type: DataTypes.ENUM,
          values: ["new", "archived"],
          allowNull: false,
        },
        applicationSource: {
          type: DataTypes.ENUM,
          values: ["website", "indeed", "craigslist"],
          allowNull: false,
        },
        applicant: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        tableName: "jobApplications",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.JobListing, {
      foreignKey: "jobListingId",
      as: "jobListing",
    });
  }
}

export default JobApplication;
