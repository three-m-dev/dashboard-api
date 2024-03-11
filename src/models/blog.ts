import { Model, DataTypes, Sequelize } from 'sequelize';
import { IBlog } from '../interfaces';

class Blog extends Model<IBlog> implements IBlog {
  public id!: string;
  public title!: string;
  public author!: string;
  public content!: string[];

  public static initialize(sequelize: Sequelize) {
    Blog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { tableName: 'blogs', underscored: true, sequelize }
    );
  }
}

export default Blog;
