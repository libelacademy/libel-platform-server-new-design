/** @format */

import mongoose from '../config/mongodb.js';

const userSchema = new mongoose.Schema(
	{
		avatar: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Storage',
			default: null,
		},
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ['student', 'instructor', 'admin'],
			default: 'student',
		},
		country: { type: String },
		phone: { type: String },
		provider: {
			type: String,
			required: true,
			enum: ['local', 'google', 'facebook'],
			default: 'local',
		},
		providerId: { type: String, default: null },

		social: {
			facebook: { type: String, default: null },
			twitter: { type: String, default: null },
			instagram: { type: String, default: null },
			linkedin: { type: String, default: null },
		},
	},
	{
		collection: 'users',
		timestamps: true,
		versionKey: false,
	},
);

userSchema.statics.findAllData = function () {
	const joinData = this.aggregate([
		{
			$lookup: {
				from: 'storage',
				localField: 'avatar',
				foreignField: '_id',
				as: 'avatar',
			},
		},
		{
			$unwind: {
				path: '$avatar',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$project: {
				avatar: {
					$cond: {
						if: { $eq: ['$avatar', null] },
						then: null,
						else: '$avatar.url',
					},
				},
				name: 1,
				email: 1,
				username: 1,
				role: 1,
				country: 1,
				phone: 1,
				provider: 1,
				providerId: 1,
				verified: 1,
				settings: 1,
				createdAt: 1,
			},
		},
	]);

	return joinData;
};

userSchema.statics.findData = function (email) {
	const joinData = this.aggregate([
		{
			$match: {
				email: email,
			},
		},
		{
			$lookup: {
				from: 'storage',
				localField: 'avatar',
				foreignField: '_id',
				as: 'avatar',
			},
		},
		{
			$unwind: {
				path: '$avatar',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$project: {
				avatar: {
					$cond: {
						if: { $eq: ['$avatar', null] },
						then: null,
						else: '$avatar.url',
					},
				},
				name: 1,
				email: 1,
				username: 1,
				role: 1,
				country: 1,
				phone: 1,
				provider: 1,
				providerId: 1,
				verified: 1,
				settings: 1,
				createdAt: 1,
				password: 1,
			},
		},
	]);

	return joinData;
};

const User = mongoose.model('User', userSchema);

export default User;
