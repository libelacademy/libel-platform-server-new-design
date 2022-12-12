/** @format */

import { Router } from 'express';
import AvatarController from '../controllers/avatars.controller.js';
import {
	isAuthorized,
	hasRole,
} from '../middleware/authorization.js';

const router = Router();
const controller = new AvatarController();

router.get('/', controller.getAvatars);
router.post(
	'/',
	[isAuthorized, hasRole(['admin'])],
	controller.createAvatar,
);
router.post(
	'/default',
	[isAuthorized, hasRole(['admin'])],
	controller.setDefaultAvatar,
);
router.delete(
	'/:id',
	[isAuthorized, hasRole(['admin'])],
	controller.deleteAvatar,
);

export default router;
