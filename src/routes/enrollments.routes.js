/** @format */

import { Router } from 'express';
import EnrollmentController from '../controllers/enrollment.controller.js';
import * as validator from '../validators/enrollment.validator.js';
import {
	isAuthorized,
	hasRole,
} from '../middleware/authorization.js';

const router = Router();
const controller = new EnrollmentController();

router.get('/me', [isAuthorized], controller.getEnrollmentsByUser);
router.post(
	'/:courseId',
	[isAuthorized, hasRole(['student', 'admin'])],
	validator.course,
	controller.addEnrollment,
);
router.delete(
	'/:id',
	[isAuthorized, hasRole(['student', 'admin'])],
	validator.id,
	controller.deleteEnrollment,
);

export default router;
