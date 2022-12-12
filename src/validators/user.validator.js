/** @format */

import results from '../utilities/results.validator.js';
import { check } from 'express-validator';

export const create = [
	check('avatar')
		.optional()
		.isMongoId()
		.withMessage('Avatar is required'),
	check('name').exists().withMessage('Name is required'),
	check('name').notEmpty().withMessage('Name is required'),
	check('email').exists().withMessage('Email is required'),
	check('email').notEmpty().withMessage('Email is required'),
	check('email').isEmail().withMessage('Email must be a valid email'),
	check('password').exists().withMessage('Password is required'),
	check('password').notEmpty().withMessage('Password is required'),
	check('password')
		.isLength({
			min: 8,
		})
		.withMessage('Password must be at least 8 characters'),
	check('role').exists().withMessage('Role is required'),
	check('role').notEmpty().withMessage('Role is required'),
	check('role')
		.isIn(['student', 'instructor', 'admin', 'superadmin'])
		.withMessage('Role must be a valid role'),
	check('country').exists().withMessage('Country is required'),
	check('country').notEmpty().withMessage('Country is required'),
	check('country').isIn([
		'MX',
		'CO',
		'ES',
		'AR',
		'VE',
		'PE',
		'CL',
		'GT',
		'EC',
		'CU',
		'BO',
		'DO',
		'HN',
		'SV',
		'NI',
		'CR',
		'PA',
		'PY',
		'UY',
		'GQ',
	]),
	check('phone').exists().withMessage('Phone is required'),
	check('phone').notEmpty().withMessage('Phone is required'),
	check('phone')
		.matches(/^[0-9]+$/)
		.withMessage('Phone must be a number'),
	check('title').optional().notEmpty(),
	(req, res, next) => results(req, res, next),
];

export const update = [
	check('avatar').optional().isMongoId(),
	check('name')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Name is required'),
	check('username')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Username is required'),
	check('email')
		.optional()
		.isEmail()
		.withMessage('Email must be a valid email'),
	check('password')
		.optional()
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters'),
	check('role')
		.optional()
		.not()
		.isEmpty()
		.withMessage('Role is required'),
	check('role')
		.optional()
		.isIn(['student', 'instructor', 'admin', 'superadmin'])
		.withMessage('Role must be a valid role'),
	check('country')
		.optional()
		.isIn([
			'MX',
			'CO',
			'ES',
			'AR',
			'VE',
			'PE',
			'CL',
			'GT',
			'EC',
			'CU',
			'BO',
			'DO',
			'HN',
			'SV',
			'NI',
			'CR',
			'PA',
			'PY',
			'UY',
			'GQ',
		])
		.withMessage('Country must be a valid country'),
	check('phone')
		.optional()
		.matches(/^[0-9]+$/)
		.withMessage('Phone must be a number'),
	check('social.facebook').optional(),
	check('social.twitter').optional(),
	check('social.linkedin').optional(),
	check('social.instagram').optional(),

	(req, res, next) => results(req, res, next),
];

export const id = [
	check('id').exists().withMessage('Id is required'),
	check('id').notEmpty().withMessage('Id is required'),
	check('id').isMongoId().withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
];

export const adminDelete = [
	check('id').exists().withMessage('Id is required'),
	check('id').notEmpty().withMessage('Id is required'),
	check('id').isMongoId().withMessage('Id must be a valid Id'),
	check('newInstructor').optional().isMongoId().withMessage('Id must be a valid Id'),
	(req, res, next) => results(req, res, next),
]

export const changePassword = [
	check('oldPassword')
		.exists()
		.withMessage('Old password is required'),
	check('oldPassword')
		.not()
		.isEmpty()
		.withMessage('Old password is required'),
	check('newPassword')
		.exists()
		.withMessage('New password is required'),
	check('newPassword')
		.not()
		.isEmpty()
		.withMessage('New password is required'),
	check('newPassword')
		.isLength({ min: 8 })
		.withMessage('New password must be at least 8 characters'),
	(req, res, next) => results(req, res, next),
];
