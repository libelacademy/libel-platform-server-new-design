/** @format */

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import config from './config/config.js';
import { connect } from './config/mongodb.js';
import router from './routes/router.js';
import cookies from 'cookie-parser';
import path from 'path';

const app = express();

// Define the port
const port = config.port || 3000;

// Middlewares
app.use('/public', express.static(path.resolve('src', 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
	cors({
		origin: [config.client, 'http://localhost:3000', 'http://127.0.0.1:3000/'],
		credentials: true,
	}),
);
app.use(cookies());
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));

// Database connection
connect(config.db.uri, config.db.config);

// Routes
app.use('/api', router);

console.log(config.enviroment)

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
