/** @format */

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		const ext = file.originalname.split('.').pop();
		cb(null, `${uuidv4()}.${ext}`);
	},
	destination: (req, file, cb) => {
		const filePath = req.query.folder
			? path.resolve('src', 'uploads', req.query.folder)
			: path.resolve('src', 'uploads');
		cb(null, filePath);
	},
});

// const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
