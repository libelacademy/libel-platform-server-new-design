/** @format */

import { validationResult } from 'express-validator';
import HttpResponse from './http.response.js';

const results = (req, res, next) => {
	try {
		validationResult(req).throw();
		return next();
	} catch (e) {
		const message =
			e.array({
				onlyFirstError: true,
			}).length > 1
				? e
						.array({
							onlyFirstError: true,
						})
						.map((error) => error.msg)
				: e.array({
						onlyFirstError: true,
				  })[0].msg;
		return HttpResponse.failure(res, 400, 'ValidationError', message);
	}
};

export default results;
