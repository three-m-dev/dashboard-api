import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import logger from './utils/logger';
import db from './models/index';

import applicantRoutes from './routes/applicantRoutes';
import applicationRoutes from './routes/applicationRoutes';
import departmentRoutes from './routes/departmentRoutes';
import employeeRoutes from './routes/employeeRoutes';
import jobRoutes from './routes/jobRoutes';
import userRoutes from './routes/userRoutes';

const NAMESPACE = 'Server';
const PORT = process.env.PORT || '8080';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

const app = express();

const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		if (!origin) {
			callback(null, true);
		} else {
			callback(null, true);
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

db.sequelize
	.sync()
	.then(() => {
		logger.info(NAMESPACE, 'Database synchronized');
	})
	.catch((err: Error) => {
		logger.error(NAMESPACE, 'Error synchronizing database', err);
	});

app.use((req, res, next) => {
	logger.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		logger.info(
			NAMESPACE,
			`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
		);
	});

	next();
});

app.use(compression());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/api/v1/applicants', applicantRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/users', userRoutes);

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Application running ${ENVIRONMENT} mode on port ${PORT}..`);
});
