/** @format */

import results from '../utilities/results.validator.js';
import { check } from 'express-validator';

export const create = [
	check('title').exists().withMessage('Title is required'),
	check('title').not().isEmpty().withMessage('Title is required'),

	// check('description')
	// 	.exists()
	// 	.withMessage('Description is required'),
	// check('description')
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('Description is required'),

	// check('image').exists().withMessage('Image is required'),
	// check('image').not().isEmpty().withMessage('Image is required'),
	// check('image').isURL().withMessage('Image must be a valid URL'),

	// check('trailer').exists().withMessage('Trailer is required'),
	// check('trailer').not().isEmpty().withMessage('Trailer is required'),
	// check('trailer').isURL().withMessage('Trailer must be a valid URL'),

	// check('category').exists().withMessage('Category is required'),
	// check('category')
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('Category is required'),
	// check('category')
	// 	.isMongoId()
	// 	.withMessage('Category must be a valid Id'),

	// check('instructor').exists().withMessage('Instructor is required'),
	// check('instructor')
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('Instructor is required'),
	// check('instructor')
	// 	.isMongoId()
	// 	.withMessage('Instructor must be a valid Id'),

	// check('level').exists().withMessage('Level is required'),
	// check('level').not().isEmpty().withMessage('Level is required'),
	// check('level').isIn(['principiante', 'intermedio', 'avanzado']),

	// check('price').exists().withMessage('Price is required'),
	// check('price').not().isEmpty().withMessage('Price is required'),
	// check('price')
	// 	.isNumeric()
	// 	.withMessage('Price must be a valid number'),

	// check('discount')
	// 	.optional()
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('Discount is required'),
	// check('discount')
	// 	.optional()
	// 	.isNumeric()
	// 	.withMessage('Discount must be a valid number'),

	// check('published').exists().withMessage('Published is required'),
	// check('published')
	// 	.isBoolean()
	// 	.withMessage('Published must be a valid boolean'),

	// check('publishedAt')
	// 	.optional()
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('PublishedAt is required'),
	// check('publishedAt')
	// 	.optional()
	// 	.isISO8601().toDate()
	// 	.withMessage('PublishedAt must be a valid date'),

	// check('withCertificate')
	// 	.exists()
	// 	.withMessage('WithCertificate is required'),
	// check('withCertificate')
	// 	.isBoolean()
	// 	.withMessage('WithCertificate must be a valid boolean'),

	// check('withFeedback')
	// 	.exists()
	// 	.withMessage('WithFeedback is required'),
	// check('withFeedback')
	// 	.isBoolean()
	// 	.withMessage('WithFeedback must be a valid boolean'),

	// check('isOnline').exists().withMessage('isOnline is required'),
	// check('isOnline')
	// 	.isBoolean()
	// 	.withMessage('isOnline must be a valid boolean'),

	// check('timeToAccess')
	// 	.exists()
	// 	.withMessage('TimeToAccess is required'),
	// check('timeToAccess')
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('TimeToAccess is required'),
	// check('timeToAccess')
	// 	.isNumeric()
	// 	.withMessage('TimeToAccess must be a valid number'),

	(req, res, next) => results(req, res, next),
];

export const update = [
	check('id').exists().withMessage('Id is required'),
	check('id').not().isEmpty().withMessage('Id is required'),
	check('id').isMongoId().withMessage('Id must be a valid Id'),
	check('title')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Title is required'),
	check('description')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Description is required'),

	check('image')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Image is required'),
	check('image')
		.optional()
		.isMongoId()
		.withMessage('Image must be a valid URL'),

	check('trailer')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Trailer is required'),
	check('trailer')
		.optional()
		.isURL()
		.withMessage('Trailer must be a valid URL'),

	check('category')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Category is required'),
	check('category')
		.optional()
		.isMongoId()
		.withMessage('Category must be a valid Id'),

	check('instructor')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Instructor is required'),
	check('instructor')
		.optional()
		.isMongoId()
		.withMessage('Instructor must be a valid Id'),

	check('level')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Level is required'),
	check('level')
		.optional()
		.isIn(['principiante', 'intermedio', 'avanzado']),

	check('price')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Price is required'),
	check('price')
		.optional()
		.isNumeric()
		.withMessage('Price must be a valid number'),

	check('discount')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Discount is required'),
	check('discount')
		.optional()
		.isNumeric()
		.withMessage('Discount must be a valid number'),

	check('status')
		.optional()
		.isIn(
			[
				'draft',
				'pre-order',
				'published',
			]
		),

	// check('publishedAt')
	// 	.optional()
	// 	.not()
	// 	.isEmpty()
	// 	.withMessage('PublishedAt is required'),
	check('publishedAt')
		.optional()
		.isISO8601()
		.toDate()
		.withMessage('PublishedAt must be a valid date'),

	check('withCertificate')
		.optional()
		.isBoolean()
		.withMessage('WithCertificate must be a valid boolean'),

	check('withFeedback')
		.optional()
		.isBoolean()
		.withMessage('WithFeedback must be a valid boolean'),

	check('isOnline')
		.optional()
		.isBoolean()
		.withMessage('isOnline must be a valid boolean'),

	check('hidden')
		.optional()
		.isBoolean()
		.withMessage('hidden must be a valid boolean'),

	check('private')
		.optional()
		.isBoolean()
		.withMessage('private must be a valid boolean'),

	check('timeToAccess')
		.optional()
		.not()
		.isEmpty()
		.withMessage('TimeToAccess is required'),
	check('timeToAccess')
		.optional()
		.isNumeric()
		.withMessage('TimeToAccess must be a valid number'),

	(req, res, next) => results(req, res, next),
];

export const id = [
	check('id').exists().withMessage('Id is required'),
	check('id').not().isEmpty().withMessage('Id is required'),
	check('id').isMongoId().withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];
