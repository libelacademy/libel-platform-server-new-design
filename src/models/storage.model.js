/** @format */

import mongoose from '../config/mongodb.js';

const categorySchema = new mongoose.Schema(
	{
		filename: { type: String, required: true, unique: true },
		folder: { type: String, default: null },
		url: { type: String, required: true, unique: true },
	},
	{
		collection: 'storage',
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model('Storage', categorySchema);
