import { Model, DataTypes, Sequelize } from "sequelize";
import { IInquiry, IMessage } from "../interfaces/ICommon";

export class Inquiry extends Model<IInquiry> implements IInquiry {
  public id!: string;
  public status!: Enumerator;
  public company!: Enumerator;
  public message!: IMessage;
  public submittedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    Inquiry.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["new", "read", "archived"],
          allowNull: false,
          defaultValue: "new",
        },
        company: {
          type: DataTypes.ENUM,
          values: ["three-m", "ultra-grip"],
          allowNull: false,
        },
        message: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: "inquiries",
        sequelize,
      }
    );
  }
}

export default Inquiry;
