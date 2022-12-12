/** @format */

import { Router } from 'express';
import CourseController from '../controllers/course.controller.js';
import {
	hasRole,
	isAuthorized,
} from '../middleware/authorization.js';
import * as validator from '../validators/course.validator.js';

const router = Router();
const controller = new CourseController();

router.get('/', controller.getCourses);
router.get(
	'/all',
	[isAuthorized, hasRole(['admin', 'instructor'])],
	controller.getAllCourses,
);
router.get('/slug/:slug', controller.getCourseBySlug);
router.get('/id/:id', controller.getCourseById);
router.get(
	'/instructor/:id',
	[isAuthorized, hasRole('admin')],
	validator.id,
	controller.getCoursesByInstructor,
);
router.post(
	'/',
	[isAuthorized, hasRole(['admin', 'instructor'])],
	controller.createCourse,
);
router.put(
	'/:id',
	[isAuthorized, hasRole(['admin', 'instructor'])],
	validator.update,
	controller.updateCourse,
);
router.delete(
	'/:id',
	[isAuthorized, hasRole(['admin'])],
	validator.id,
	controller.deleteCourse,
);

export default router;
