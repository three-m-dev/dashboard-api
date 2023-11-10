import { Model, DataTypes, Sequelize } from 'sequelize';
import { IMessage, IMessageBody } from '../interfaces/ICommon';

export class Message extends Model<IMessage> implements IMessage {
	public id!: string;
	public status!: Enumerator;
	public company!: Enumerator;
	public body!: IMessageBody;
	public submittedAt!: Date;

	public static initialize(sequelize: Sequelize) {
		Message.init(
			{
				id: {
					type: DataTypes.UUID,
					allowNull: false,
					primaryKey: true,
					defaultValue: DataTypes.UUIDV4,
				},
				status: {
					type: DataTypes.ENUM,
					values: ['read', 'unread'],
					allowNull: false,
					defaultValue: 'unread',
				},
				company: {
					type: DataTypes.ENUM,
					values: ['three-m', 'ultra-grip'],
					allowNull: false,
				},
				body: {
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
				tableName: 'messages',
				sequelize,
			}
		);
	}
}

export default Message;
