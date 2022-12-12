/** @format */

import { matchedData } from 'express-validator';

import AnnouncementService from '../services/announcement.service.js';
import AvatarService from '../services/avatars.service.js';
import CategoryService from '../services/category.serivce.js';
import CourseService from '../services/course.service.js';
import EnrollmentService from '../services/enrollment.service.js';
import LikeService from '../services/like.service.js';
import UserService from '../services/user.service.js';

import DbErrorHandler from '../utilities/db-error.handler.js';
import Emailer from '../utilities/emailer.handler.js';
import HttpResponse from '../utilities/http.response.js';

const sender = new Emailer();

export default class UserController {
	async getAllUsers(_req, res) {
		try {
			const result = await UserService.getAll();
			return HttpResponse.success(
				res,
				200,
				result,
				'Users retrieved successfully',
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

	async getUserByUsername(req, res) {
		try {
			const { username } = req.params;
			const result = await UserService.geOne(username);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'User retrieved successfully',
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

	async createUser(req, res) {
		try {
			req = matchedData(req);
			const result = await UserService.create(req);
			if (!result.created) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'UserNotCreated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			const user = await UserService.getById(result.user._id);
			return HttpResponse.success(
				res,
				201,
				user,
				'User created successfully',
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

	async updateUser(req, res) {
		try {
			const user = req.user;
			const data = matchedData(req);

			const result = await UserService.update(user.id, data);
			if (!result.updated) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'UserNotUpdated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}
			const updatedUser = await UserService.getById(user.id);
			return HttpResponse.success(
				res,
				200,
				updatedUser,
				'User updated successfully',
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

	async updatePassword(req, res) {
		try {
			const user = req.user;
			const data = matchedData(req);

			const existUser = await UserService.getById(user.id);

			if (!existUser) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}

			const isPasswordMatch = await UserService.validate(
				existUser.email,
				data.oldPassword,
			);

			if (!isPasswordMatch) {
				return HttpResponse.failure(
					res,
					400,
					'PasswordNotMatch',
					'Password not match',
				);
			}

			const result = await UserService.update(user.id, {
				password: data.newPassword,
			});

			if (!result.updated) {
				return HttpResponse.failure(
					res,
					DbErrorHandler.getErrorStatusCode(result.error),
					'PasswordNotUpdated',
					DbErrorHandler.getErrorMessage(result.error),
				);
			}

			return HttpResponse.success(
				res,
				200,
				{},
				'Password updated successfully',
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

	async deleteUser(req, res) {
		try {
			const user = req.user;
			req = matchedData(req);
			const id = user.role === 'admin' ? req.id : user.id;
			const userToDeleted = await UserService.getById(id);
			if (!userToDeleted) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}
			if (userToDeleted.role === 'student') {
				await LikeService.deleteByUserId(userToDeleted._id);
				await EnrollmentService.deleteByUserId(userToDeleted._id);
			}

			if (userToDeleted.role === 'instructor') {
				if (req.newInstructor) {
					await CourseService.changeInstructor(
						userToDeleted._id,
						req.newInstructor,
					);
				} else {
					await CourseService.deleteByInstructor(userToDeleted._id);
				}
			}

			const result = await UserService.delete(userToDeleted._id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}

			await sender.deleteAccountEmail(
				userToDeleted.email,
				userToDeleted.name,
			);
			return HttpResponse.success(
				res,
				200,
				userToDeleted._id,
				'User deleted successfully',
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

	async getAdminData(req, res) {
		try {
			const data = {};
			data.users = await UserService.getAll();
			data.courses = await CourseService.getAll(true);
			data.categories = await CategoryService.getAllData();
			data.avatars = await AvatarService.getAll();
			data.announcements = {
				current: await AnnouncementService.getLatest(),
				history: await AnnouncementService.getAll(),
			};
			return HttpResponse.success(
				res,
				200,
				data,
				'Admin data retrieved successfully',
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

	async getProfile(req, res) {
		try {
			let profile = {};
			const auth = req.user;
			req = matchedData(req);
			const id = req.id ? req.id : auth.id;
			const user = await UserService.getById(id);
			if (!user) {
				return HttpResponse.failure(
					res,
					404,
					'UserNotFound',
					'User not found',
				);
			}

			if (user.role === 'admin') {
				profile.courses = await CourseService.getByCreator(user.id);
			}

			if (user.role === 'instructor') {
				profile.courses = await CourseService.getByInstructor(
					user.id,
				);
			}

			if (user.role === 'student') {
				profile.enrollments = await EnrollmentService.getByUserId(
					user.id,
				);
				profile.likes = await LikeService.getByUserId(user.id);
			}

			return HttpResponse.success(res, 200, profile, 'User profile');
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async getInstructors(req, res) {
		try {
			const instructors = await UserService.getInstructors();
			return HttpResponse.success(
				res,
				200,
				instructors,
				'Instructors retrieved successfully',
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
