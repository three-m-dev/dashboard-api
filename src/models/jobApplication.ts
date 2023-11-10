import { Model, DataTypes, Sequelize } from 'sequelize';
import { IApplicant, IJobApplication } from '../interfaces/ICommon';

export class JobApplication extends Model<IJobApplication> implements IJobApplication {
	public id!: string;
	public jobListingId!: string;
	public status!: Enumerator;
	public source!: Enumerator;
	public applicant!: IApplicant;
	public submittedAt!: Date;
	public processedAt?: Date;

	public static initialize(sequelize: Sequelize) {
		JobApplication.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				jobListingId: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM,
					values: ['new', 'archived'],
					defaultValue: 'new',
					allowNull: false,
				},
				source: {
					type: DataTypes.ENUM,
					values: ['website', 'indeed'],
					defaultValue: 'website',
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
				tableName: 'jobApplications',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		this.belongsTo(models.JobListing, {
			foreignKey: 'jobListingId',
			as: 'jobListing',
		});
	}
}

export default JobApplication;
