import { Model, DataTypes, Sequelize } from 'sequelize';
import { IProductionLog } from '../shared/interfaces';

export class ProductionLog extends Model<IProductionLog> implements IProductionLog {
	public id!: string;
	public weekOf!: Date;
	public projectedOutput!: number;
	public actualOutput!: number;
	public outputGoal!: number;
	public quotedHours?: number;
	public actualHours?: number;
	public indirectHours?: number;
	public notes?: string;
	public createdBy!: string;
	public updatedBy?: string;

	public static initialize(sequelize: Sequelize) {
		ProductionLog.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				weekOf: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				projectedOutput: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				actualOutput: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				outputGoal: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				quotedHours: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				actualHours: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				indirectHours: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				notes: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				createdBy: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				updatedBy: {
					type: DataTypes.STRING,
					allowNull: true,
				},
			},
			{
				tableName: 'productionLogs',
				sequelize,
			}
		);
	}
}

export default ProductionLog;
