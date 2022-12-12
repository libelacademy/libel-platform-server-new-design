/** @format */

import Category from '../models/category.model.js';

export default class CategoryService {
	static async getAll() {
		return await Category.aggregate([
			{
				$lookup: {
					from: 'courses',
					let: { id: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$category', '$$id'] },
							},
						},
						{
							$match: { hidden: false },
						},
						{
							$match: {
								status: {
									$in: ['published', 'pre-order'],
								},
							},
						},
					],
					as: 'courses',
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
					slug: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					courses: {
						$cond: {
							if: { $isArray: '$courses' },
							then: { $size: '$courses' },
							else: 'NA',
						},
					},
				},
			},
		]);
	}

	static async getAllData() {
		return await Category.aggregate([
			{
				$lookup: {
					from: 'courses',
					let: { id: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$category', '$$id'] },
							},
						},
						{
							$match: { hidden: false },
						},
						{
							$match: {
								status: {
									$in: ['published', 'pre-order'],
								},
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
								let: { id: '$instructor' },
								pipeline: [
									{
										$match: {
											$expr: { $eq: ['$_id', '$$id'] },
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
					],
					as: 'courses',
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
					slug: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					courses: 1,
					createdAt: 1,
				},
			},
		]);
	}

	static async getData(id) {
		return await Category.aggregate([
			{
				$match: { _id: id },
			},
			{
				$lookup: {
					from: 'courses',
					let: { id: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: { $eq: ['$category', '$$id'] },
							},
						},
						{
							$match: { hidden: false },
						},
						{
							$match: {
								status: {
									$in: ['published', 'pre-order'],
								},
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
								let: { id: '$instructor' },
								pipeline: [
									{
										$match: {
											$expr: { $eq: ['$_id', '$$id'] },
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
					],
					as: 'courses',
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
					slug: 1,
					image: {
						$cond: {
							if: { $eq: ['$image', null] },
							then: null,
							else: '$image.url',
						},
					},
					courses: 1,
					createdAt: 1,
				},
			},
		]);
	}

	static async getOne(slug) {
		return await Category.findOne({
			slug,
		});
	}

	static async getById(id) {
		return await Category.findById(id).populate('image');
	}

	static async create(category) {
		try {
			const result = await Category.create(category);
			return {
				created: true,
				category: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async update(id, category) {
		try {
			const result = await Category.findByIdAndUpdate(id, category, {
				new: true,
			});
			return {
				updated: true,
				category: result,
			};
		} catch (error) {
			return {
				updated: false,
				error,
			};
		}
	}

	static async delete(id) {
		return await Category.findByIdAndDelete(id);
	}
}
