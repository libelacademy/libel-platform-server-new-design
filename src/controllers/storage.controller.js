/** @format */

import StorageService from '../services/storage.service.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import HttpResponse from '../utilities/http.response.js';
import config from '../config/config.js';

export default class StorageController {
	async uploadFile(req, res) {
		try {
			const file = req.file;
			const folder = req.query.folder;
			const result = await StorageService.create({
				filename: file.filename,
				url: `${config.publicUrl}/${folder ? folder + '/' : ''}${
					file.filename
				}`,
				folder: folder ? folder : null,
			});
			if (!result.created) {
				return HttpResponse.failure(
					res,
					500,
					result.error.name,
					result.error.message,
				);
			}
			return HttpResponse.success(
				res,
				201,
				result.file,
				'File uploaded successfully',
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

	async getFile(req, res) {
		try {
			const { url } = req.body;
			const filename = url.split('/').pop();
			const result = await StorageService.getOne(filename);
			console.log(result);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'FileNotFound',
					'File not found',
				);
			}
			return res.redirect(result.url);
		} catch (error) {
			return HttpResponse.failure(
				res,
				500,
				error.name,
				error.message,
			);
		}
	}

	async deleteFile(req, res) {
		try {
			const { id } = req.params;
			console.log(id)
			const result = await StorageService.delete(id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'FileNotFound',
					'File not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'File deleted successfully',
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
