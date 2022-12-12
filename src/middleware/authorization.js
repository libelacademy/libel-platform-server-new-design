/** @format */

import HttpResponse from '../utilities/http.response.js';
import JwtHandler from '../utilities/jwt.handler.js';

export const isAuthorized = async (req, res, next) => {
	const token = req.cookies.libelAcademyToken;
	const decoded = JwtHandler.verify(token);
	if (!decoded) {
		return HttpResponse.failure(
			res,
			403,
			'Forbidden',
			'You are not allowed to access this resource',
		);
	}
	req.user = decoded;
	next();
};

export const hasRole = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return HttpResponse.failure(
			res,
			403,
			'Forbidden',
			'You are not allowed to access this resource',
		);
	}
	next();
};

export const isMyUser = (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return HttpResponse.failure(
      res,
      403,
      'Forbidden',
      'You are not allowed to access this resource',
    );
  }
  next();
}
