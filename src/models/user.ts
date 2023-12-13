import { Model, DataTypes, Sequelize } from 'sequelize';
import { IUser } from '../shared/interfaces';

export class User extends Model<IUser> implements IUser {
	public id!: string;
	public username!: string;
	public password!: string;
	public accountType!: string;
	public permissionsId!: string;
	public isActive!: boolean;

	public static initialize(sequelize: Sequelize) {
		User.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				username: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				accountType: {
					type: DataTypes.ENUM('admin', 'employee', 'developer'),
					defaultValue: 'employee',
					allowNull: false,
				},
				permissionsId: {
					type: DataTypes.STRING,
					defaultValue: '1',
					allowNull: false,
				},
				isActive: {
					type: DataTypes.BOOLEAN,
					defaultValue: true,
					allowNull: false,
				},
			},
			{
				tableName: 'users',
				sequelize,
			}
		);
	}

	public static associate(models: any) {
		this.hasOne(models.Employee, {
			foreignKey: 'userId',
			as: 'employee',
		});
	}
}

export default User;
