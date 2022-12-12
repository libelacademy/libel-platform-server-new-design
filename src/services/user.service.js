/** @format */

import User from '../models/user.model.js';
import HandlerPassword from '../utilities/password.handler.js';
import generateUsername from '../utilities/username.generator.js';
import AvatarService from './avatars.service.js';

export default class UserService {
	static async getAll() {
		return await User.find().populate({
			path: 'avatar',
			select: 'url',
		})
		.select('-password')
		.sort({ createdAt: -1 });
	}

	static async geOne(id) {
		return await User.findData(id);
	}

	static async getByUsername(username) {
		return await User.findOne({ username });
	}

	static async getByEmail(email) {
		return await User.findOne({ email }).populate({
			path: 'avatar',
			select: 'url',
		});
	}

	static async getById(id) {
		const result = await User.findById(id)
			.populate({
				path: 'avatar',
				select: 'url',
			})
			.select('-password');
		return result;
	}

	static async getInstructors() {
		return await User.find({ role: 'instructor' }).populate({
			path: 'avatar',
			select: 'url',
		});
	}

	static async create(data) {
		try {
			const username = generateUsername(data.email);
			const hash = await HandlerPassword.encryptPassword(
				data.password,
			);
			const avatar = await AvatarService.getDefatult();

			const user = await User.create({
				...data,
				avatar: avatar.image._id,
				username,
				password: hash,
			});

			return {
				created: true,
				user: user,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async update(id, user) {
		try {
			if (user.password) {
				user.password = await HandlerPassword.encryptPassword(
					user.password,
				);
			}
			const result = await User.findByIdAndUpdate(id, user, {
				new: true,
			});
			return {
				updated: true,
				user: result,
			};
		} catch (error) {
			return {
				updated: false,
				error,
			};
		}
	}

	static async delete(id) {
		return await User.findByIdAndDelete(id);
	}

	static async validate(email, password) {
		const user = await this.getByEmail(email);
		if (!user) return false;
		// if (user.verified === false) return false;
		const isValidate = await HandlerPassword.comparePassword(
			password,
			user.password,
		);
		if (!isValidate) return false;
		return user;
	}
}
