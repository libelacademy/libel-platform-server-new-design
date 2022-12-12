/** @format */

import Storage from '../models/storage.model.js';
import fs from 'fs';
import path from 'path';

export default class StorageService {
	static async create(file) {
		try {
			const result = await Storage.create(file);
			return {
				created: true,
				file: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async getOne(filename) {
		return await Storage.findOne({ filename });
	}

	static async getAll() {
		return await Storage.find({});
	}

	static async delete(id) {
		const file = await Storage.findById(id);
		if (file) {
			const filePath = file.folder
				? path.resolve('src', 'uploads', file.folder, file.filename)
				: path.resolve('src', 'uploads', file.filename);
			fs.unlinkSync(filePath);
			return await Storage.findByIdAndDelete(file._id);
		}

		return null;
	}
}
