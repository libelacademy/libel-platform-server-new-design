/** @format */

import results from '../utilities/results.validator.js';
import { check } from 'express-validator';

export const login = [
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
	(req, res, next) => results(req, res, next),
];

export const register = [
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
	(req, res, next) => results(req, res, next),
];


export const verify = [
	check('token').exists().withMessage('Token is required'),
	check('token').notEmpty().withMessage('Token is required'),
	(req, res, next) => results(req, res, next),
]

export const email = [
	check('email').exists().withMessage('Email is required'),
	check('email').notEmpty().withMessage('Email is required'),
	check('email').isEmail().withMessage('Email must be a valid email'),
	(req, res, next) => results(req, res, next),
]