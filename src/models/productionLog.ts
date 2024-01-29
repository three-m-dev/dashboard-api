import { Model, DataTypes, Sequelize } from 'sequelize';
import { IProductionLog } from '../shared/interfaces';

export class ProductionLog extends Model<IProductionLog> implements IProductionLog {
	public id!: string;
	public weekOf!: string;
	public projectedOutput!: number;
	public actualOutput!: number;
	public outputGoal!: number;
	public quotedHours!: number;
	public actualHours!: number;
	public indirectHours!: number;
	public totalHours!: number;
	public notes!: string;
	public createdBy!: string;
	public updatedBy!: string;

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
					type: DataTypes.STRING,
					allowNull: false,
				},
				projectedOutput: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				actualOutput: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				outputGoal: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				quotedHours: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				actualHours: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				totalHours: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				indirectHours: {
					type: DataTypes.FLOAT,
					defaultValue: 0,
					allowNull: false,
				},
				notes: {
					type: DataTypes.STRING,
					defaultValue: '',
					allowNull: false,
				},
				createdBy: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				updatedBy: {
					type: DataTypes.STRING,
					defaultValue: '',
					allowNull: false,
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
