import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import logging from './config/logging';
import db from './models/index';

import userRoutes from './routes/userRoutes';
import employeeRoutes from './routes/employeeRoutes';
import jobListingRoutes from './routes/jobListingRoutes';
import jobApplicationRoutes from './routes/jobApplicationRoutes';
import subscriberRoutes from './routes/subscriberRoutes';

const NAMESPACE = 'Server';
const router = express();
const PORT: string = process.env.PORT || '3000';
const NODE_ENV: string = process.env.NODE_ENV || 'development';

db.sequelize
	.sync()
	.then(() => {
		logging.info(NAMESPACE, 'Database synchronized');
	})
	.catch((err: Error) => {
		logging.error(NAMESPACE, 'Error synchronizing database', err);
	});

router.use((req, res, next) => {
	logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		logging.info(
			NAMESPACE,
			`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
		);
	});

	next();
});

router.use(
	cors({
		credentials: true,
	})
);

router.use(compression());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use('/api/v1/users', userRoutes);
router.use('/api/v1/employees', employeeRoutes);
router.use('/api/v1/job-listings', jobListingRoutes);
router.use('/api/v1/job-applications', jobApplicationRoutes);
router.use('/api/v1/subscribers', subscriberRoutes);

const app = http.createServer(router);

app.listen(PORT, () => {
	console.log(`Application running ${NODE_ENV} mode on port ${PORT}..`);
});
