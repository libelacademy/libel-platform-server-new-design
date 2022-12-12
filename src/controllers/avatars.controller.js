/** @format */

import AvatarService from '../services/avatars.service.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import HttpResponse from '../utilities/http.response.js';

export default class AvatarController {
	async getAvatars(req, res) {
		try {
			const result = await AvatarService.getAll();
			return HttpResponse.success(
				res,
				200,
				result,
				'Avatars retrieved successfully',
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

	async createAvatar(req, res) {
		try {
			const { name, image } = req.body;

			const result = await AvatarService.create({
				name,
				image,
			});
			if (!result.created) {
				return HttpResponse.failure(
					res,
					500,
					result.error.name,
					result.error.message,
				);
			}
			const avatar = await AvatarService.getOne(result.avatar._id);
			return HttpResponse.success(
				res,
				201,
				avatar,
				'Avatar created successfully',
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

	async setDefaultAvatar(req, res) {
		try {
			const { image } = req.body;
			const defaultAvatar = await AvatarService.getDefatult();

			if (defaultAvatar) {
				defaultAvatar.image = image;
				await defaultAvatar.save();
			} else {
				await AvatarService.create({
					name: 'default',
					image,
					default: true,
				});
			}

			const result = await AvatarService.getDefatult()

			return HttpResponse.success(
				res,
				200,
				result,
				'Default avatar updated successfully',
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

	async deleteAvatar(req, res) {
		try {
			const { id } = req.params;
			const result = await AvatarService.delete(id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'AvatarNotFound',
					'Avatar not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				id,
				'Avatar deleted successfully',
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
