/** @format */

import { matchedData } from 'express-validator';
import passwordGenerator from 'generate-password';
import UserService from '../services/user.service.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import Emailer from '../utilities/emailer.handler.js';
import HttpResponse from '../utilities/http.response.js';
import JwtHandler from '../utilities/jwt.handler.js';

const sender = new Emailer();

export default class AuthController {
	async login(req, res) {
		try {
			req = matchedData(req);
			const { email, password } = req;
			const user = await UserService.validate(email, password);
			if (!user) {
				return HttpResponse.failure(
					res,
					401,
					'Unauthorized',
					'Credenciales Inválidas',
				);
			}
			user.set('password', undefined, { strict: false });
			const acessToken = JwtHandler.sign(user);
			return HttpResponse.loginSuccess(
				res,
				user,
				acessToken,
				'Ingreso exitoso.',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async logout(req, res) {
		try {
			return HttpResponse.logoutSuccess(res);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async register(req, res) {
		try {
			req = matchedData(req);
			const newUser = req;
			const result = await UserService.create(newUser);
			if (!result.created) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'UserNotCreated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			const user = await UserService.getById(result.user._id);

			user.set('password', undefined, { strict: false });
			await sender.welcomeEmail(result.user.email, result.user.name);
			const acessToken = JwtHandler.sign(user);
			return HttpResponse.loginSuccess(
				res,
				user,
				acessToken,
				'Registro exitoso.',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async forgotPassword(req, res) {
		try {
			req = matchedData(req);
			const { email } = req;
			const user = await UserService.getByEmail(email);
			if (!user) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}
			const newPassword = passwordGenerator.generate({
				length: 10,
				numbers: true,
				symbols: true,
			});
			const result = await UserService.update(user._id, {
				password: newPassword,
			});
			if (!result.updated) {
				return HttpResponse.failure(res);
			}
			await sender.resetPasswordEmail(
				user.email,
				user.name,
				newPassword,
			);
			return HttpResponse.success(res, 200, null, 'Email sent');
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}


	async validateSession(req, res) {
		try {
			const id = req.user.id;
			const user = await UserService.getById(id);
			return HttpResponse.success(
				res,
				200,
				user,
				'Valid session',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}


	// async verificationEmail(req, res) {
	// 	try {
	// 		req = matchedData(req);
	// 		const { token } = req;
	// 		const payload = JwtHandler.verify(token);
	// 		if (!payload) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				401,
	// 				'Unauthorized',
	// 				'Invalid token',
	// 			);
	// 		}
	// 		const user = await UserService.getById(payload.id);
	// 		if (!user) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				404,
	// 				'UserNotFound',
	// 				'User not found',
	// 			);
	// 		}
	// 		if (user.verified) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				400,
	// 				'AlreadyVerified',
	// 				'Email already verified',
	// 			);
	// 		}
	// 		const result = await UserService.update(payload.id, {
	// 			verified: true,
	// 		});
	// 		if (!result.updated) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				401,
	// 				'Unauthorized',
	// 				'Invalid token',
	// 			);
	// 		}
	// 		// if (result.user.role === 'student') {
	// 		// 	await StudentService.create({ user: result.user._id });
	// 		// }
	// 		// if (result.user.role === 'instructor') {
	// 		// 	await InstructorService.create({ user: result.user._id });
	// 		// }
	// 		result.user.set('password', undefined, { strict: false });
	// 		await sender.welcomeEmail(result.user.email, result.user.name);
	// 		return HttpResponse.success(
	// 			res,
	// 			200,
	// 			result.user,
	// 			'Email verified',
	// 		);
	// 	} catch (error) {
	// 		return HttpResponse.failure(
	// 			res,
	// 			500,
	// 			error.name,
	// 			error.message,
	// 		);
	// 	}
	// }

	// async resendVerificationEmail(req, res) {
	// 	try {
	// 		req = matchedData(req);
	// 		const { email } = req;
	// 		const user = await UserService.getByEmail(email);
	// 		if (!user) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				404,
	// 				'UserNotFound',
	// 				'User not found',
	// 			);
	// 		}
	// 		if (user.verified) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				400,
	// 				'AlreadyVerified',
	// 				'Email already verified',
	// 			);
	// 		}
	// 		const verifyToken = JwtHandler.sign(user, '1h');
	// 		await sender.verificationEmail(
	// 			user.email,
	// 			user.name,
	// 			verifyToken,
	// 		);
	// 		return HttpResponse.success(res, 200, null, 'Email sent');
	// 	} catch (error) {
	// 		return HttpResponse.failure(
	// 			res,
	// 			500,
	// 			error.name,
	// 			error.message,
	// 		);
	// 	}
	// }

	// async resetPassword(req, res) {
	// 	try {
	// 		req = matchedData(req);
	// 		const { token } = req;
	// 		const payload = JwtHandler.verify(token);
	// 		if (!payload) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				401,
	// 				'Unauthorized',
	// 				'Invalid token',
	// 			);
	// 		}
	// 		const user = await UserService.getById(payload.id);
	// 		if (!user) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				404,
	// 				'UserNotFound',
	// 				'User not found',
	// 			);
	// 		}
	// 		const newPassword = passwordGenerator.generate({
	// 			length: 10,
	// 			numbers: true,
	// 		});
	// 		const result = await UserService.update(payload.id, {
	// 			password: newPassword,
	// 		});
	// 		if (!result.updated) {
	// 			return HttpResponse.failure(
	// 				res,
	// 				401,
	// 				'Unauthorized',
	// 				'Invalid token',
	// 			);
	// 		}
	// 		result.user.set('password', undefined, { strict: false });
	// 		await sender.resetPasswordEmail(
	// 			result.user.email,
	// 			result.user.name,
	// 			newPassword,
	// 		);
	// 		return HttpResponse.success(
	// 			res,
	// 			200,
	// 			result.user,
	// 			'Password changed',
	// 		);
	// 	} catch (error) {
	// 		return HttpResponse.failure(
	// 			res,
	// 			500,
	// 			error.name,
	// 			error.message,
	// 		);
	// 	}
	// }

}
