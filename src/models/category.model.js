/** @format */

import mongoose from '../config/mongodb.js';

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true },
		image: { type: mongoose.Schema.Types.ObjectId, ref: 'Storage' },
		courses: [
			{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
		],
	},
	{
		collection: 'categories',
		timestamps: true,
		versionKey: false,
	},
);


const Category = mongoose.model('Category', categorySchema);

export default Category;
