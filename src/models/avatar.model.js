/** @format */

import mongoose from '../config/mongodb.js';

const avatarSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		image: { type: mongoose.Schema.Types.ObjectId, ref: 'Storage' },
		default: { type: Boolean, default: false },
	},
	{
		collection: 'avatars',
		timestamps: true,
		versionKey: false,
	},
);

const Avatar = mongoose.model('Avatar', avatarSchema);

export default Avatar;
