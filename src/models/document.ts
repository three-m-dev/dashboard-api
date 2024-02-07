import { Model } from 'sequelize';
import { IDocument } from '../interfaces';

class Document extends Model<IDocument> implements IDocument {
  public id!: string;
  public ownerId?: string | undefined;
  public ownerType!: string;
  public documentType!: string;
  public s3URL!: string;
}

export default Document;
