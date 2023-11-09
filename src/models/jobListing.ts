import { Model, DataTypes, Sequelize } from 'sequelize';
import { IJobListing } from '../interfaces/ICommon';

export class JobListing extends Model<IJobListing> implements IJobListing {
	public jobListingId!: string;
	public title!: string;
	public description!: string;
	public company!: Enumerator;
	public location!: Enumerator;
	public department!: string;
	public employmentType!: Enumerator;
	public requirements!: object;
	public qualifications!: object;
	public salaryRange!: string;
	public benefits!: object;
	public listingStatus!: Enumerator;
	applicantCount!: number;
	public createdBy!: string;
	public updatedBy!: string;

	public static initialize(sequelize: Sequelize) {
		JobListing.init(
			{
				jobListingId: {
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
					values: ['three-m', 'ultra-grip'],
					allowNull: false,
				},
				location: {
					type: DataTypes.ENUM,
					values: ['on-site', 'remote', 'hybrid'],
					allowNull: false,
				},
				department: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				employmentType: {
					type: DataTypes.ENUM,
					values: ['full-time', 'part-time', 'internship', 'subcontract'],
					allowNull: false,
				},
				requirements: {
					type: DataTypes.JSON,
					allowNull: false,
				},
				qualifications: {
					type: DataTypes.JSON,
					allowNull: false,
				},
				salaryRange: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				benefits: {
					type: DataTypes.JSON,
					allowNull: false,
				},
				listingStatus: {
					type: DataTypes.ENUM,
					values: ['open', 'closed', 'paused', 'filled', 'archived'],
					defaultValue: 'open',
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
				tableName: 'jobListings',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		this.hasMany(models.JobApplication, {
			foreignKey: 'jobListingId',
			as: 'application',
		});
	}
}

export default JobListing;
