import { Model, DataTypes, Sequelize } from 'sequelize';
import { IDocument } from '../interfaces';

class Document extends Model<IDocument> implements IDocument {
  public id!: string;
  public ownerId?: string | undefined;
  public ownerType!: string;
  public documentType!: string;
  public s3URL!: string;

  public static initialize(sequelize: Sequelize) {
    Document.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        ownerId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        ownerType: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        documentType: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        s3URL: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      { tableName: 'documents', underscored: true, sequelize }
    );
  }
}

export default Document;
