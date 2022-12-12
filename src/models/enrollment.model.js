/** @format */

import { now } from 'mongoose';
import mongoose from '../config/mongodb.js';

const enrollmentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'active', 'completed'],
			default: 'active',
		},
		expired: {
			type: Boolean,
			default: false,
		},
		completedAt: { type: Date, default: null },
		expiredAt: { type: Date, default: null },
		completedLessons: [{ type: String }],
		currentLesson: { type: String, default: null },
		startedAt: { type: Date, default: now },
	},
	{
		collection: 'enrollments',
		versionKey: false,
		timestamps: true,
	},
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
