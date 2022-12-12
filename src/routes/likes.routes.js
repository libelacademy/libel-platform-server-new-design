/** @format */

import { Router } from 'express';
import LikeController from '../controllers/like.controller.js';
import * as validator from '../validators/like.validator.js';
import {
	isAuthorized,
	hasRole,
} from '../middleware/authorization.js';

const router = Router();
const controller = new LikeController();

router.get('/me', [isAuthorized], controller.getLikesByUser);

router.post(
	'/:courseId',
	[isAuthorized, hasRole(['student'])],
  validator.course,
	controller.addLike,
);
router.delete(
	'/:courseId',
	[isAuthorized, hasRole(['student'])],
  validator.course,
	controller.deleteLike,
);


export default router;
