import { Model, DataTypes, Sequelize } from "sequelize";
import { ICareer } from "../shared/interfaces";

export class Career extends Model<ICareer> implements ICareer {
  public id!: string;
  public title!: string;
  public description!: string;
  public location!: Enumerator;
  public company!: Enumerator;
  public department!: string;
  public employmentType!: Enumerator;
  public responsibilities!: object;
  public qualifications!: object;
  public startingAt!: string;
  public compensationType!: Enumerator;
  public benefits!: object;
  public status!: Enumerator;
  public applicantCount!: number;
  public createdBy!: string;
  public updatedBy!: string;

  public static initialize(sequelize: Sequelize) {
    Career.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        company: {
          type: DataTypes.ENUM,
          values: ["three-m", "ultra-grip"],
          allowNull: false,
        },
        location: {
          type: DataTypes.ENUM,
          values: ["on-site", "remote", "hybrid"],
          allowNull: false,
        },
        department: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        employmentType: {
          type: DataTypes.ENUM,
          values: ["full-time", "part-time", "contract", "internship"],
          allowNull: false,
        },
        responsibilities: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        qualifications: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        startingAt: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        compensationType: {
          type: DataTypes.ENUM,
          values: ["salary", "hourly"],
          allowNull: false,
        },
        benefits: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["active", "inactive", "pending", "filled", "cancelled"],
          defaultValue: "active",
          allowNull: false,
        },
        applicantCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        tableName: "careers",
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.hasMany(models.Application, {
      foreignKey: "careerId",
      as: "application",
    });
  }
}

export default Career;
