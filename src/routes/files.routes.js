/** @format */

import { Router } from 'express';
import StorageController from '../controllers/storage.controller.js';
import upload from '../middleware/multer.js';

const router = Router();
const controller = new StorageController();

router.get('/', controller.getFile);
router.post('/', upload.single('file'), controller.uploadFile);
router.delete('/:id', controller.deleteFile);

export default router;
