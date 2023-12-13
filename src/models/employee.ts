import { Model, DataTypes, Sequelize } from 'sequelize';
import { IEmployee } from '../shared/interfaces';

export class Employee extends Model<IEmployee> implements IEmployee {
	public id!: string;
	public userId!: string;
	public firstName!: string;
	public lastName!: string;
	public email?: string;
	public phone?: string;
	public addressId?: string;
	public birthDate?: Date;
	public title!: string;
	public departmentId!: string;
	public directReportId!: string;
	public type!: Enumerator;
	public status!: Enumerator;
	public startDate!: Date;
	public endDate?: Date;
	public notes?: string;
	public createdBy!: string;
	public updatedBy?: string;

	public static initialize(sequelize: Sequelize) {
		Employee.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				userId: {
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
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				departmentId: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				directReportId: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				type: {
					type: DataTypes.ENUM('full-time', 'part-time', 'contractor', 'intern'),
					defaultValue: 'full-time',
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM('active', 'inactive', 'terminated'),
					defaultValue: 'active',
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
				createdBy: {
					type: DataTypes.UUID,
					allowNull: false,
				},
				updatedBy: {
					type: DataTypes.UUID,
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
		this.belongsTo(models.User, {
			foreignKey: 'userId',
			as: 'user',
		});
	}
}

export default Employee;