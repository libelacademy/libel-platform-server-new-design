/** @format */

import { Router } from 'express';
import AnnouncementController from '../controllers/announcement.controller.js';
import * as validator from '../validators/announcement.validator.js';
import {
	isAuthorized,
	hasRole,
} from '../middleware/authorization.js';

const router = Router();
const controller = new AnnouncementController();

router.get('/latest', controller.getLatestAnnouncement);
router.get(
	'/',
	[isAuthorized, hasRole(['admin'])],
	controller.getAnnouncements,
);
router.post(
	'/',
	[isAuthorized, hasRole(['admin'])],
	validator.create,
	controller.createAnnouncement,
);
router.delete(
	'/:id',
	[isAuthorized, hasRole(['admin'])],
	validator.id,
	controller.deleteAnnouncement,
);

export default router;
