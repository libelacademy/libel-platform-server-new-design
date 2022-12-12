/** @format */

import mongoose from '../config/mongodb.js';

const announcementSchema = new mongoose.Schema(
	{
		message: { type: String, required: true },
		url: { type: String, required: true },
		visible: { type: Boolean, default: true },
	},
	{
		collection: 'announcements',
		timestamps: true,
		versionKey: false,
	},
);

const Announcement = mongoose.model(
	'Announcement',
	announcementSchema,
);

export default Announcement;
