import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import logger from './utils/logger';
import db from './models/index';

import { EmailService } from './services/emailService';

import cameraRoutes from './routes/cameraRoutes';
import careerRoutes from './routes/careerRoutes';
import messageRoutes from './routes/messageRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import teamRoutes from './routes/teamRoutes';

const NAMESPACE = 'Server';
const router = express();
const PORT: string = process.env.PORT || '3000';
const NODE_ENV: string = process.env.NODE_ENV || 'development';

EmailService.initializeTemplates();

db.sequelize
	.sync()
	.then(() => {
		logger.info(NAMESPACE, 'Database synchronized');
	})
	.catch((err: Error) => {
		logger.error(NAMESPACE, 'Error synchronizing database', err);
	});

router.use((req, res, next) => {
	logger.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		logger.info(
			NAMESPACE,
			`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
		);
	});

	next();
});

router.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
		optionsSuccessStatus: 200,
	})
);
router.use(compression());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/api/v1/cameras', cameraRoutes);
router.use('/api/v1/careers', careerRoutes);
router.use('/api/v1/messages', messageRoutes);
router.use('/api/v1/subscribers', subscriberRoutes);
router.use('/api/v1/team', teamRoutes);

const app = http.createServer(router);

app.listen(PORT, () => {
	console.log(`Application running ${NODE_ENV} mode on port ${PORT}..`);
});
