/** @format */

import mongoose from 'mongoose';
import Course from '../models/course.model.js';
import EnrollmentService from './enrollment.service.js';
import LikeService from './like.service.js';

export default class CourseService {
	static async getAll() {
		return await Course.aggregate([
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						creator: '$createdBy',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$creator'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'createdBy',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$createdBy',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdBy: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
	}

	static async getVisible() {
		return await Course.aggregate([
			{
				$match: {
					$and: [
						{
							hidden: false,
						},
						{
							status: {
								$ne: 'draft',
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
	}

	static async getByCategory(category) {
		return await Course.aggregate([
			{
				$match: {
					$and: [
						{
							category,
						},
						{
							hidden: false,
						},
						{
							status: {
								$ne: 'draft',
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
	}

	static async getByCreator(creator) {
		return await Course.aggregate([
			{
				$match: {
					createdBy: mongoose.Types.ObjectId(creator),
				},
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
	}

	static async getByInstructor(instructor) {
		return await Course.aggregate([
			{
				$match: {
					instructor: mongoose.Types.ObjectId(instructor),
				},
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
	}

	static async getOne(slug) {
		const [course] = await Course.aggregate([
			{
				$match: {
					$and: [
						{
							slug,
						},
						{
							status: {
								$ne: 'draft',
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
		if (!course) {
			return null;
		} else {
			return course;
		}
	}

	static async getById(id) {
		const [course] = await Course.aggregate([
			{
				$match: {
					_id: mongoose.Types.ObjectId(id),
				}
			},
			{
				$lookup: {
					from: 'likes',
					localField: '_id',
					foreignField: 'course',
					as: 'likes',
				},
			},
			{
				$lookup: {
					from: 'enrollments',
					localField: '_id',
					foreignField: 'course',
					as: 'students',
				},
			},
			{
				$lookup: {
					from: 'categories',
					let: {
						category: '$category',
					},
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$_id', '$$category'] },
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'image',
								foreignField: '_id',
								as: 'image',
							},
						},
						{
							$unwind: {
								path: '$image',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								image: {
									$cond: {
										if: { $eq: ['$image', null] },
										then: null,
										else: '$image.url',
									},
								},
							},
						},
					],
					as: 'category',
				},
			},
			{
				$lookup: {
					from: 'storage',
					localField: 'image',
					foreignField: '_id',
					as: 'image',
				},
			},
			{
				$lookup: {
					from: 'users',
					let: {
						instructor: '$instructor',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$_id', '$$instructor'],
								},
							},
						},
						{
							$lookup: {
								from: 'storage',
								localField: 'avatar',
								foreignField: '_id',
								as: 'avatar',
							},
						},
						{
							$unwind: {
								path: '$avatar',
								preserveNullAndEmptyArrays: true,
							},
						},
						{
							$project: {
								name: 1,
								avatar: {
									$cond: {
										if: { $eq: ['$avatar', null] },
										then: null,
										else: '$avatar.url',
									},
								},
							},
						},
					],
					as: 'instructor',
				},
			},
			{
				$unwind: {
					path: '$category',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$image',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$instructor',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					title: 1,
					slug: 1,
					description: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					trailer: 1,
					category: 1,
					instructor: 1,
					level: 1,
					duration: 1,
					status: 1,
					publishedAt: 1,
					hidden: 1,
					private: 1,
					price: 1,
					discount: 1,
					students: {
						$cond: {
							if: { $isArray: '$students' },
							then: { $size: '$students' },
							else: '0',
						},
					},
					likes: {
						$cond: {
							if: { $isArray: '$likes' },
							then: { $size: '$likes' },
							else: '0',
						},
					},
					withCertificate: 1,
					withFeedback: 1,
					isOnline: 1,
					timeToAccess: 1,
					materials: 1,
					feedbacks: 1,
					lessons: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);
		if (!course) {
			return null;
		} else {
			return course;
		}
	}

	static async create(course) {
		try {
			console.log(course);
			const result = await Course.create(course);
			return {
				created: true,
				course: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async update(id, course) {
		try {
			const result = await Course.findByIdAndUpdate(id, course, {
				new: true,
			});
			return {
				updated: true,
				course: result,
			};
		} catch (error) {
			return {
				updated: false,
				error,
			};
		}
	}

	static async delete(id) {
		try {
			const result = await Course.findByIdAndDelete(id);
			await LikeService.deleteByCourseId(id);
			await EnrollmentService.deleteByCourseId(id);
			return result;
		} catch (error) {
			return null;
		}
	}

	static async changeInstructor(oldInstrunctor, newInstructor) {
		return await Course.updateMany(
			{ instructor: oldInstrunctor },
			{ instructor: newInstructor },
		);
	}

	static async deleteByInstructor(instructorId) {
		const courses = await Course.find({ instructor: instructorId });
		for (let i = 0; i < courses.length; i++) {
			await LikeService.deleteByCourseId(courses[i]._id);
			await EnrollmentService.deleteByCourseId(courses[i]._id);
		}
		return await Course.deleteMany({ instructor: instructorId });
	}
}
