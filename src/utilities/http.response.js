/** @format */
import config from '../config/config.js';

export default class HttpResponse {
	
	static success(res, status, data, message) {
		return res.status(status || 200).json({
			success: true,
			data,
			message,
		});
	}

	static failure(res, status, error, message) {
		return res.status(status || 500).json({
			success: false,
			error: error || 'InternalServerError',
			message: message || 'Internal Server Error',
		});
	}

	static loginSuccess(res, data, token, message) {
		return res
			.status(200)
			.cookie('libelAcademyToken', token, {
				httpOnly: true,
				secure: config.enviroment === 'production' ? true : false,
				sameSite:	config.enviroment === 'production' ? 'none' : 'lax',
				expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
			})
			.json({
				success: true,
				message,
				data,
			});
	}

	static logoutSuccess(res) {
		return res.status(200).clearCookie('libelAcademyToken').json({
			success: true,
			message: 'Desconexión exitosa.',
		});
	}
}