import { Model, DataTypes, Sequelize } from 'sequelize';
import { IDepartment } from '../shared/interfaces';

export class Department extends Model<IDepartment> implements IDepartment {
	public id!: string;
	public company!: Enumerator;
	public name!: string;

	public static initialize(sequelize: Sequelize) {
		Department.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				company: {
					type: DataTypes.ENUM('three-m', 'ultra-grip'),
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				tableName: 'departments',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		Department.hasMany(models.Employee, {
			as: 'employees',
			foreignKey: 'departmentId',
			sourceKey: 'id',
		});
	}
}

export default Department;
