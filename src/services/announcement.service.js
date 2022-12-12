/** @format */

import Announcement from '../models/announcement.model.js';

export default class AnnouncementService {
	static async getAll() {
		return await Announcement.find({}).sort({ createdAt: -1 });

	}

	static async getLatest() {
		return await Announcement.findOne({}).sort({ createdAt: -1 });
	}

	static async create(announcement) {
		try {
			const result = await Announcement.create(announcement);
			return {
				created: true,
				announcement: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async delete(id) {
		return await Announcement.findByIdAndDelete(id);
	}
}
