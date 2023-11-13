import { Model, DataTypes, Sequelize } from "sequelize";
import { ICamera } from "../interfaces/ICommon";

export class Camera extends Model<ICamera> implements ICamera {
  public id!: string;
  public status!: Enumerator;
  public name!: string;
  public ipAddress!: string;
  public port!: string;
  public username!: string;
  public password!: string;

  public static initialize(sequelize: Sequelize) {
    Camera.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["online", "offline", "error", "idle", "disabled"],
          allowNull: false,
          defaultValue: "offline",
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ipAddress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        port: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "cameras",
        sequelize,
      }
    );
  }
}

export default Camera;
