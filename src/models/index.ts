import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import config from '../config/database';

const basename = path.basename(__filename);
const db: { [key: string]: any } = {};

let sequelize: Sequelize;

sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect as any,
});

fs.readdirSync(__dirname)
	.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts')
	.forEach((file) => {
		const modelPath = path.join(__dirname, file);
		const modelModule = require(modelPath).default;
		modelModule.initialize(sequelize);
		db[modelModule.name] = modelModule;
	});

Object.keys(db).forEach((modelName) => {
	if (typeof db[modelName].associate === 'function') {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
