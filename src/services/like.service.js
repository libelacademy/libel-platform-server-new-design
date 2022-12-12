/** @format */

import Like from '../models/like.model.js';

export default class LikeService {
	static async getAll() {
		return await Like.find({});
	}

	static async getByUserId(user) {
		return await Like.find({ user }).populate({
      path: 'course',
      populate: [
        {
          path: 'category',
          select: 'name',
        },
        {
          path: 'instructor',
          select: 'name avatar',
          populate: {
            path: 'avatar',
            select: 'url',
          }
        },
        {
          path: 'image',
          select: 'url',
        }
      ]
    })
	}

	static async create(course, user) {
		try {
			const result = await Like.create({
				course,
				user,
			});
			return {
				created: true,
				like: result,
			};
		} catch (error) {
			return {
				created: false,
				error,
			};
		}
	}

	static async delete(course, user) {
		return await Like.findOneAndDelete({ course, user });
	}

	static async deleteByUserId(user) {
		return await Like.deleteMany({ user });
	}

	static async deleteByCourseId(course) {
		return await Like.deleteMany({ course });
	}
}
