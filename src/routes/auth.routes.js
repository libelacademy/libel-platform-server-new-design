/** @format */

import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { isAuthorized } from '../middleware/authorization.js';
import * as validator from '../validators/auth.validator.js';

const router = Router();
const controller = new AuthController();

router.post('/login', validator.login, controller.login);
router.post('/logout', controller.logout);
router.post('/register', validator.register, controller.register);
router.post(
	'/forgot-password',
	validator.email,
	controller.forgotPassword,
);
router.get('/me', [isAuthorized], controller.validateSession);

// router.post('/reset-password/:token', validator.verify, controller.resetPassword);
// router.post('/verify/:token', validator.verify, controller.verificationEmail);
// router.post('/resend-verification', validator.email, controller.resendVerificationEmail);

export default router;
