/** @format */

import Enrollment from '../models/enrollment.model.js';
import CourseService from './course.service.js';

export default class EnrollmentService {
	static async getAll() {
		return await Enrollment.find({});
	}

	static async getById(id) {
		return await Enrollment.findById(id).populate({
			path: 'course',
			populate: [
				{
					path: 'category',
					select: 'name',
				},
				{
					path: 'instructor',
					select: 'name avatar',
					populate: {
						path: 'avatar',
						select: 'url',
					},
				},
				{
					path: 'image',
					select: 'url',
				},
			],
		})
	}

	static async getByUserId(user) {
		return await Enrollment.find({ user })
			.populate({
				path: 'course',
				populate: [
					{
						path: 'category',
						select: 'name',
					},
					{
						path: 'instructor',
						select: 'name avatar',
						populate: {
							path: 'avatar',
							select: 'url',
						},
					},
					{
						path: 'image',
						select: 'url',
					},
				],
			})
			.sort({ createdAt: -1 });
	}

	static async create(courseId, user) {
		try {
			const course = await CourseService.getById(courseId);
			if (!course) {
				return {
					created: false,
					error: {
						name: 'CourseNotFound',
						message: 'Course not found',
					},
				};
			}

			const enrollment = await Enrollment.findOne({
				course: courseId,
				user,
				status: {
					$in: ['pending', 'active'],
				},
			});
			if (enrollment) {
				return {
					created: false,
					error: {
						name: 'EnrollmentExists',
						message: 'Enrollment already exists',
					},
				};
			}

			const start =
				course.status === 'pre-order'
					? new Date(course.publishedAt)
					: new Date();

			const expire = new Date(
				new Date(start).setMonth(
					new Date(start).getMonth() + course.timeToAccess,
				),
			);

			const result = await Enrollment.create({
				course: courseId,
				user,
				status: course.status === 'published' ? 'active' : 'pending',
				startedAt: start,
				expiredAt: expire,
			});
			const data = await EnrollmentService.getById(result._id);
			return {
				created: true,
				enrollment: data,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async delete(id) {
		return await Enrollment.findByIdAndDelete(id);
	}

	static async deleteByUserId(user) {
		return await Enrollment.deleteMany({ user });
	}

	static async deleteByCourseId(course) {
		return await Enrollment.deleteMany({ course });
	}
}
