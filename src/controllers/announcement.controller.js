/** @format */

import { matchedData } from 'express-validator';
import AnnouncementService from '../services/announcement.service.js';
import DbErrorHandler from '../utilities/db-error.handler.js';
import HttpResponse from '../utilities/http.response.js';

export default class AnnouncementController {
	async getAnnouncements(req, res) {
		try {
			const history = await AnnouncementService.getAll();
			const current = await AnnouncementService.getLatest();
			return HttpResponse.success(
				res,
				200,
				{
					history,
					current,
				},
				'Announcements retrieved successfully',
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

	async createAnnouncement(req, res) {
		try {
			req = matchedData(req);
			const { message, url } = req;

			const result = await AnnouncementService.create({
				message,
				url,
			});
			if (!result.created) {
				return HttpResponse.failure(
					res,
					500,
					result.error.name,
					result.error.message,
				);
			}
			const history = await AnnouncementService.getAll();
			return HttpResponse.success(
				res,
				201,
				{
					current: result.announcement,
					history,
				},
				'Announcement created successfully',
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

	async getLatestAnnouncement(req, res) {
		try {
			const result = await AnnouncementService.getLatest();
			return HttpResponse.success(
				res,
				200,
				result,
				'Latest announcement retrieved successfully',
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

	async deleteAnnouncement(req, res) {
		try {
			req = matchedData(req);
			const { id } = req;
			const result = await AnnouncementService.delete(id);
			if (!result) {
				return HttpResponse.failure(
					res,
					404,
					'Announcement not found',
					'Announcement not found',
				);
			}
			return HttpResponse.success(
				res,
				200,
				result,
				'Announcement deleted successfully',
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
