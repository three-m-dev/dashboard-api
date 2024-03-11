import { Model, DataTypes, Sequelize } from 'sequelize';
import { IApplicant } from '../interfaces';
export { IApplicant } from '../interfaces';

class Applicant extends Model<IApplicant> implements IApplicant {
  public id!: string;
  public careerId?: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public s3URL!: string;
  public questionAnswers!: string[];

  public static initialize(sequelize: Sequelize) {
    Applicant.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        careerId: {
          type: DataTypes.STRING,
          allowNull: true,
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
        s3URL: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        questionAnswers: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      { tableName: 'applicants', underscored: true, sequelize }
    );
  }
}

export default Applicant;
