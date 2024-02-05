import { Model, DataTypes, Sequelize } from 'sequelize';
import { IProductionLog } from '../interfaces';

class ProductionLog extends Model<IProductionLog> implements IProductionLog {
  public id!: string;
  public company!: string;
  public weekOf!: string;
  public properties!: { [property: string]: number };
  public notes?: string;

  public static initialize(sequelize: Sequelize) {
    ProductionLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        company: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        weekOf: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        properties: {
          type: DataTypes.JSON,
          defaultValue: {},
          allowNull: false,
        },
        notes: {
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
