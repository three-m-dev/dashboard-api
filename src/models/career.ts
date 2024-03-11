import { Model, DataTypes, Sequelize } from 'sequelize';
import { ICareer } from '../interfaces';

class Career extends Model<ICareer> implements ICareer {
  public id!: string;
  public company!: string;
  public title!: string;
  public location!: string;
  public employmentType!: string;
  public salary!: string;
  public description!: string;
  public benefits!: string[];
  public qualifications!: string[];
  public responsibilities!: string[];
  public schedule!: string[];
  public questions!: string[];
  public positionsOpen!: number;

  public static initialize(sequelize: Sequelize) {
    Career.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        company: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        employmentType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        salary: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        benefits: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        qualifications: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        responsibilities: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        schedule: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        questions: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        positionsOpen: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      { tableName: 'careers', underscored: true, sequelize }
    );
  }
}

export default Career;
