/** @format */

import mongoose from '../config/mongodb.js';
import User from './user.model.js';

const courseSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true },
		description: { type: String, default: '' },
		image: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Storage',
			default: null,
		},
		trailer: { type: String, default: '' },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			default: null,
		},
		instructor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		level: {
			type: String,
			enum: ['principiante', 'intermedio', 'avanzado'],
			default: 'principiante',
		},
		duration: { type: Number, default: 0 },
		status: {
			type: String,
			enum: ['draft', 'pre-order', 'published'],
			default: 'draft',
		},
		publishedAt: { type: Date, default: null },

		hidden: { type: Boolean, default: false },
		private: { type: Boolean, default: false },

		price: { type: Number, default: 0 },
		discount: { type: Number, default: 0 },

		students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

		withCertificate: { type: Boolean, default: false },
		withFeedback: { type: Boolean, default: false },
		isOnline: { type: Boolean, default: false },
		timeToAccess: { type: Number, default: 12 },

		materials: [{ type: String }],
		lessons: [{ type: String }],
		feedbacks: [{ type: String }],

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		collection: 'courses',
		timestamps: true,
		versionKey: false,
	},
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
