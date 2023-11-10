import { Model, DataTypes, Sequelize } from 'sequelize';
import { IUser } from '../interfaces/ICommon';

export class User extends Model<IUser> implements IUser {
	public id!: string;
	public username!: string;
	public password!: string;
	public accountType!: string;
	public isActive!: boolean;
	public createdBy!: string;
	public updatedBy!: string;

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
					type: DataTypes.STRING,
					allowNull: false,
				},
				isActive: {
					type: DataTypes.BOOLEAN,
					defaultValue: true,
					allowNull: false,
				},
				createdBy: {
					type: DataTypes.UUID,
					defaultValue: '00000000-0000-0000-0000-000000000000',
					allowNull: false,
				},
				updatedBy: {
					type: DataTypes.UUID,
					allowNull: true,
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
