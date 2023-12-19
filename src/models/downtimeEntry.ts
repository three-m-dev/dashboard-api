import { Model, DataTypes, Sequelize } from 'sequelize';
import { IDowntimeEntry } from '../shared/interfaces';

export class DowntimeEntry extends Model<IDowntimeEntry> implements IDowntimeEntry {
  public id!: string;
  public operatorId!: string;
  public date!: string;
  public downtime!: {
    [reason: string]: number;
  };
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
}

export default DowntimeEntry;
