/** @format */

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export default class JwtHandler {
	static sign(payload, expires = config.jwt.expiresIn) {
		return jwt.sign(
			{
				id: payload._id,
				role: payload.role,
			},
			config.jwt.secret,
			{
				expiresIn: expires,
			},
		);
	}

	static verify(token) {
		try {
			return jwt.verify(token, config.jwt.secret);
		} catch (error) {
			return null;
		}
	}
}
