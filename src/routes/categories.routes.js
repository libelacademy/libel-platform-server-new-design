/** @format */

import { Router } from 'express';
import * as validator from '../validators/category.validator.js';
import CategoryController from '../controllers/category.controller.js';

const router = Router();
const controller = new CategoryController();

router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategoryById);
router.post('/', validator.create, controller.createCategory);
router.put('/:id', validator.update, controller.updateCategory);
router.delete('/:id', validator.id, controller.deleteCategory);

export default router;
