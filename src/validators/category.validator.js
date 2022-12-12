/** @format */

import results from '../utilities/results.validator.js';
import { check } from 'express-validator';

export const create = [
	check('name').exists().withMessage('Name is required'),
	check('name').not().isEmpty().withMessage('Name is required'),
	check('image').exists().withMessage('Image is required'),
	check('image').not().isEmpty().withMessage('Image is required'),
	check('image').isMongoId()
	.withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];

export const update = [
	check('id')
		.exists()
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	check('name')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Name is required'),
	check('image')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Image is required'),
	check('image')
		.optional()
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];

export const id = [
	check('id')
		.exists()
		.isMongoId()
		.withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];
