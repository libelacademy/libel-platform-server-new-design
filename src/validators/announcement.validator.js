/** @format */

import results from '../utilities/results.validator.js';
import { check } from 'express-validator';

export const create = [
	check('message').exists().withMessage('Message is required'),
	check('message').not().isEmpty().withMessage('Message is required'),
	check('url').exists().withMessage('Url is required'),
	check('url').not().isEmpty().withMessage('Url is required'),
	check('url').isURL().withMessage('Url must be a valid Url'),
	(req, res, next) => results(req, res, next),
];

export const id = [
	check('id')
		.exists()
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];
