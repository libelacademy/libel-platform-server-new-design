/** @format */

import { Router } from 'express';
import * as validator from '../validators/user.validator.js';
import UserController from '../controllers/user.controller.js';
import { isAuthorized, hasRole } from '../middleware/authorization.js';

const router = Router();

const controller = new UserController();

router.get('/', controller.getAllUsers);
router.get('/instructors', [isAuthorized, hasRole(['admin'])], controller.getInstructors)
router.get('/username/:username', controller.getUserByUsername);
router.get('/me', [isAuthorized], controller.getProfile);
router.put('/me', [isAuthorized], validator.update, controller.updateUser);
router.put('/me/password', [isAuthorized], validator.changePassword, controller.updatePassword);
router.delete('/me', [isAuthorized], controller.deleteUser);

router.post('/',  [isAuthorized, hasRole(['admin'])], validator.create, controller.createUser);
// router.put('/:id', validator.update, controller.updateUser);
router.delete('/:id', [isAuthorized, hasRole(['admin'])], validator.adminDelete, controller.deleteUser);
router.get('/admin',[isAuthorized, hasRole(['admin'])], controller.getAdminData )
router.get('/profile/:id', [isAuthorized, hasRole(['admin'])], validator.id, controller.getProfile)

export default router;
