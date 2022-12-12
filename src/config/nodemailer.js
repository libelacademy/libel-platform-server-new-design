/** @format */

import nodeMailer from 'nodemailer';
import { google } from 'googleapis';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import config from './config.js';

const { gmail } = config;

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
	gmail.clientId,
	gmail.clientSecret,
	gmail.redirectUri,
);

oauth2Client.setCredentials({
	refresh_token: gmail.refreshToken,
});

const accessToken = new Promise((resolve, reject) => {
	oauth2Client.getAccessToken((err, token) => {
		if (err) {
			reject(err);
		}
		resolve(token);
	});
});

const trasnporter = nodeMailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: gmail.user,
		clientId: gmail.clientId,
		accessToken,
		clientSecret: gmail.clientSecret,
		refreshToken: gmail.refreshToken,
	},
});

trasnporter.use(
	'compile',
	hbs({
		viewEngine: {
			extName: '.hbs',
			defaultLayout: null,
		},
		viewPath: path.resolve('./src/templates'),
		extName: '.hbs',
	}),
);

export default trasnporter;
