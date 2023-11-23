import { Model, DataTypes, Sequelize } from 'sequelize';
import { ICareerListing } from '../interfaces/ICommon';

export class CareerListing extends Model<ICareerListing> implements ICareerListing {
	public id!: string;
	public title!: string;
	public description!: string;
	public location!: Enumerator;
	public company!: Enumerator;
	public department!: string;
	public employmentType!: Enumerator;
	public requirements!: object;
	public qualifications!: object;
	public startingAt!: string;
	public compensationType!: Enumerator;
	public benefits!: object;
	public status!: Enumerator;
	public applicantCount!: number;
	public createdBy!: string;
	public updatedBy!: string;

	public static initialize(sequelize: Sequelize) {
		CareerListing.init(
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
					values: ['Three M', 'Ultra Grip'],
					allowNull: false,
				},
				location: {
					type: DataTypes.ENUM,
					values: ['On Site', 'Remote', 'Hybrid'],
					allowNull: false,
				},
				department: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				employmentType: {
					type: DataTypes.ENUM,
					values: ['Full Time', 'Part Time', 'Contract', 'Internship'],
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
				startingAt: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				compensationType: {
					type: DataTypes.ENUM,
					values: ['Salary', 'Hourly'],
					allowNull: false,
				},
				benefits: {
					type: DataTypes.JSON,
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM,
					values: ['Active', 'Inactive', 'Pending', 'Filled', 'Cancelled'],
					defaultValue: 'Active',
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
				tableName: 'careerListings',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		this.hasMany(models.CareerApplication, {
			foreignKey: 'careerListingId',
			as: 'application',
		});
	}
}

export default CareerListing;
