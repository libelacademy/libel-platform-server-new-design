/** @format */

import Avatar from '../models/avatar.model.js';

export default class AvatarService {
	static async getAll() {
		return await Avatar.find({})
			.populate('image')
			.sort({ createdAt: -1 });
	}

	static async getOne(id) {
		return await Avatar.findById(id).populate('image');
	}

	static async create(avatar) {
		try {
			const result = await Avatar.create(avatar);
			return {
				created: true,
				avatar: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async getDefatult() {
		return await Avatar.findOne({ default: true }).populate('image');
	}

	static async delete(id) {
		return await Avatar.findByIdAndDelete(id);
	}
}
