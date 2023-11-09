import { Model, DataTypes, Sequelize } from 'sequelize';
import { ISubscriber } from '../interfaces/ICommon';

export class Subscriber extends Model<ISubscriber> implements ISubscriber {
	public subscriberId!: string;
	public email!: string;
	public subscribedAt!: Date;
	public isSubscribed!: boolean;
	public unsubscribeToken!: string;
	public unsubscribedAt?: Date;

	public static initialize(sequelize: Sequelize) {
		Subscriber.init(
			{
				subscriberId: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
					primaryKey: true,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				subscribedAt: {
					type: DataTypes.DATE,
					defaultValue: DataTypes.NOW,
					allowNull: false,
				},
				isSubscribed: {
					type: DataTypes.BOOLEAN,
					defaultValue: true,
					allowNull: false,
				},
				unsubscribeToken: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					allowNull: false,
				},
				unsubscribedAt: {
					type: DataTypes.DATE,
					allowNull: true,
				},
			},
			{
				tableName: 'subscribers',
				sequelize,
			}
		);
	}
}

export default Subscriber;
