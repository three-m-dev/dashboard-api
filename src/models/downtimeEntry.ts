import { Model, DataTypes, Sequelize } from 'sequelize';
import { IDowntimeEntry, IEmployee } from '../shared/interfaces';

export class DowntimeEntry extends Model<IDowntimeEntry> implements IDowntimeEntry {
  public id!: string;
  public operatorId!: string;
  public date!: string;
  public downtime!: {
    [reason: string]: number;
  };
  public total!: number;
  public notes?: string;
  public createdBy!: string;
  public updatedBY?: string;

  public static initialize(sequelize: Sequelize) {
    DowntimeEntry.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        operatorId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        date: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        downtime: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        total: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        tableName: 'downtimeEntries',
        sequelize,
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.Employee, {
      foreignKey: 'operatorId',
      as: 'operator',
    });
  }
}

export default DowntimeEntry;
