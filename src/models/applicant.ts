import { Model, DataTypes, Sequelize } from 'sequelize';
import { IApplicant } from '../shared/interfaces';

export class Applicant extends Model<IApplicant> implements IApplicant {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public resumeRef?: string;
  public resumeLink?: string;
  public answers?: string[];
  public additionalInfo?: string;

  public static initialize(sequelize: Sequelize) {
    Applicant.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
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
        resumeRef: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resumeLink: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        answers: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        additionalInfo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: 'applicants',
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.hasMany(models.Application, {
      foreignKey: 'applicantId',
      as: 'applications',
    });
  }
}

export default Applicant;
