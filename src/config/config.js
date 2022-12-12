/** @format */

import dotenv from 'dotenv';

const createEnvirontment = () => {
	const env = process.env.NODE_ENV;
	const path = ['env'];
	if (env) {
		path.push(env);
	}
	return '.' + path.join('.');
};

dotenv.config({
	path: createEnvirontment(),
});

const config = {
	port: process.env.PORT,
	hostname: process.env.HOSTNAME,
	client: process.env.CLIENT,
	publicUrl: process.env.PUBLIC_URL,
	enviroment: process.env.NODE_ENV || 'production',
	client: process.env.CLIENT,
	db: {
		uri: process.env.DB_URI,
		config: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN,
	},
	gmail: {
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		refreshToken: process.env.GMAIL_REFRESH_TOKEN,
		redirectUri: process.env.GMAIL_REDIRECT_URI,
		user: process.env.GMAIL_USER,
	},
};

export default config;
