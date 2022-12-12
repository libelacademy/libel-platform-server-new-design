/** @format */

import { matchedData } from 'express-validator';
import urlSlug from 'url-slug';
import CourseService from '../services/course.service.js';
import CategoryService from '../services/category.serivce.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import HttpResponse from '../utilities/http.response.js';

export default class CourseController {
	async getCourses(req, res) {
		try {
			let result;
			const category = await CategoryService.getOne(
				req.query.category,
			);
			if (category) {
				result = await CourseService.getByCategory(category._id);
			} else {
				result = await CourseService.getVisible()
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Courses retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getAllCourses(req, res) {
		try {
			let result = {};
			if (req.user.role === 'instructor') {
				result = await CourseService.getByInstructor(req.user.id);
			} else {
				result = await CourseService.getAll();
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Courses retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getCourseBySlug(req, res) {
		try {
			const { slug } = req.params;
			const result = await CourseService.getOne(slug);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'CourseNotFound',
					'Course not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Course retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getCoursesByInstructor(req, res) {
		try {
			req = matchedData(req);
			const result = await CourseService.getByInstructor(req.id);
			return HttpResponse.success(
				res,
				200,
				result,
				'Courses retrieved successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getCourseById(req, res) {
		try {
			const { id } = req.params;
			const result = await CourseService.getById(id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'CourseNotFound',
					'Course not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Course retrieved successfully',
			);
		} catch (error) {
			console.log(error);
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async createCourse(req, res) {
		try {
			// req = matchedData(req);
			const course = req.body;
			course.slug = urlSlug(course.title);
			const result = await CourseService.create({
				createdBy: req.user.id,
				...course,
			});
			if (!result.created) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'CourseNotCreated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			return HttpResponse.success(
				res,
				201,
				result.course,
				'Course created successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async updateCourse(req, res) {
		try {
			req = matchedData(req);
			const { id, ...course } = req;
			if (course.title) {
				course.slug = urlSlug(course.title);
			}
			console.log(course);
			const result = await CourseService.update(id, course);
			if (!result.updated) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'CourseNotUpdated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			return HttpResponse.success(
				res,
				200,
				result.course,
				'Course updated successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async deleteCourse(req, res) {
		try {
			req = matchedData(req);
			const { id } = req;
			const result = await CourseService.delete(id);
			return HttpResponse.success(
				res,
				200,
				result._id,
				'Course deleted successfully',
			);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}
}
