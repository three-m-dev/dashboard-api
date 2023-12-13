import { Model, DataTypes, Sequelize } from 'sequelize';
import { IJob } from '../shared/interfaces';

export class Job extends Model<IJob> implements IJob {
	public id!: string;
	public companyId!: string;
	public departmentId!: string;
	public title!: string;
	public description!: string;
	public location!: Enumerator;
	public type!: Enumerator;
	public status!: Enumerator;
	public benefits?: string[];
	public requirements?: string[];
	public qualifications?: string[];
	public schedule?: string[];
	public salary?: number;
	public wage?: number;
	public positionsOpen!: number;
	public createdBy!: string;
	public updatedBy?: string;
	public closingAt?: Date;

	public static initialize(sequelize: Sequelize) {
		Job.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				companyId: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				departmentId: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				location: {
					type: DataTypes.ENUM,
					values: ['onsite', 'remote'],
					allowNull: false,
				},
				type: {
					type: DataTypes.ENUM,
					values: ['full-time', 'part-time', 'contract', 'internship'],
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM,
					values: ['open', 'closed', 'archived'],
					allowNull: false,
				},
				benefits: {
					type: DataTypes.JSON,
					allowNull: true,
				},
				requirements: {
					type: DataTypes.JSON,
					allowNull: true,
				},
				qualifications: {
					type: DataTypes.JSON,
					allowNull: true,
				},
				schedule: {
					type: DataTypes.JSON,
					allowNull: true,
				},
				salary: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				wage: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				positionsOpen: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				createdBy: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				updatedBy: {
					type: DataTypes.UUID,
					allowNull: true,
				},
				closingAt: {
					type: DataTypes.DATE,
					allowNull: true,
				},
			},
			{
				sequelize,
				tableName: 'jobs',
			}
		);
	}
}

export default Job;
