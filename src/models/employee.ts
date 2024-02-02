import { Model, DataTypes, Sequelize } from 'sequelize';
import { IEmployee } from '../interfaces';

export class Employee extends Model<IEmployee> implements IEmployee {
	public id!: string;
	public accountId!: string;
	public firstName!: string;
	public lastName!: string;
	public email?: string;
	public phone?: string;
	public addressId?: string;
	public birthDate?: Date;
	public company!: Enumerator;
	public department!: Enumerator;
	public directReportId!: string;
	public title!: string;
	public status!: Enumerator;
	public startDate!: Date;
	public endDate?: Date;
	public notes?: string;

	public static initialize(sequelize: Sequelize) {
		Employee.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				accountId: {
					type: DataTypes.UUID,
					allowNull: false,
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
					allowNull: true,
				},
				phone: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				addressId: {
					type: DataTypes.UUID,
					allowNull: true,
				},
				birthDate: {
					type: DataTypes.DATE,
					allowNull: true,
				},
				company: {
					type: DataTypes.ENUM,
					values: ['three-m', 'ultra-grip'],
					allowNull: false,
				},
				department: {
					type: DataTypes.ENUM,
					values: [
						'human-resources',
						'marketing',
						'sales',
						'production',
						'development',
						'management',
						'information-technology',
						'machining',
						'assembly',
						'quality',
						'engineering',
						'finance',
						'accounting',
						'customer-service',
						'purchasing',
						'shipping',
						'receiving',
						'inventory',
						'warehouse',
						'logistics',
						'supply-chain',
						'health-safety',
						'environmental',
					],
					allowNull: false,
				},
				directReportId: {
					type: DataTypes.UUID,
					defaultValue: '00000000-0000-0000-0000-000000000000',
					allowNull: false,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM,
					values: ['full-time', 'part-time', 'contractor', 'intern', 'inactive'],
					allowNull: false,
				},
				startDate: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				endDate: {
					type: DataTypes.DATE,
					allowNull: true,
				},
				notes: {
					type: DataTypes.STRING,
					allowNull: true,
				},
			},
			{
				tableName: 'employees',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		Employee.belongsTo(models.Account, {
			foreignKey: 'accountId',
			as: 'account',
		});
	}
}

export default Employee;
