import dotenv from 'dotenv';
dotenv.config();

type Config = {
	username: string;
	password: string;
	database: string;
	host: string;
	dialect: string;
};

const development: Config = {
	username: process.env.DB_DEVELOPMENT_USERNAME!,
	password: process.env.DB_DEVELOPMENT_PASSWORD!,
	database: process.env.DB_DEVELOPMENT_DATABASE!,
	host: process.env.DB_DEVELOPMENT_HOST!,
	dialect: 'mysql',
};

const production: Config = {
	username: process.env.DB_PRODUCTION_USERNAME!,
	password: process.env.DB_PRODUCTION_PASSWORD!,
	database: process.env.DB_PRODUCTION_DATABASE!,
	host: process.env.DB_PRODUCTION_HOST!,
	dialect: 'mysql',
};

const env: 'development' | 'production' = (process.env.ENVIRONMENT || 'development') as 'development' | 'production';

const config = { development, production };

export default config[env];
